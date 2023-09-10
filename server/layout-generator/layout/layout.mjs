import * as fs from 'fs';
import sharp from "sharp";
import fetch from 'node-fetch';
import createDZI from "../image/dzi.mjs";
import { getLayoutById, insertLayout } from '../../db/crud-layouts.mjs';
import { getNoteById } from "../../db/crud-notes.mjs";
import dzi from '../image/dzi.mjs';


/*
const createLayout;
Creates a functional layout object of notes and images
Inputs: 
* pattern: a 2D array containing Note ObjectIDs

Output:
* Uploads a directory of DZI files to AWS S3 bucket
* Inserts a layout object to Mongo Atlas
* Returns the ObjectID of the newly inserted layout object

Side effects:
* Generates large temp files which are deleted upon program termination

*/
export const TEMP_DIR = `./layout-generator/temp/`;

export class Layout {
    constructor(layoutId) {
        if (layoutId) {
            // Layout ID provided: layout already exists in Mongo/S3
            this._id = layoutId
            return;
        }
    }

    // Initializes a new layout; only called for layouts that do not yet exist
    async init(options,callback) {
        throw new Error('Method \'init()\' must be implemented and call initializeLayout().');
        callback.bind(this)();
    }

    async initializeLayout(options) {
        if (this._id) {
            await this.fromDb();
        }
        else {
            await this.fromOptions(options);
        }
        
        if (options.generate) {
            // Generates zoomable image, adds to S3, and adds URL to layout object
            await this.createImage(options.saveFiles);
        }

        this.insert();
    }

    async fromDb() {
        if (!this.id) throw new Error('No layout ID provided.');
        const layoutObj = await getLayoutById(this.id);

        if (!layoutObj) throw new Error('No existing layout found in DB.');

        this.name = layoutObj.name;
        this.array = layoutObj.array;
        this.image = layoutObj.image;
        this.numCols = layoutObj.numCols;
        this.numRows = layoutObj.numRows;
        this.noteImageSize = layoutObj.noteImageSize;

        console.log('Successfully initialized layout from DB.')

        return;
    }

    async fromOptions(options) {
        
        if (!this.name && !options.name) {
            throw new Error('No layout name provided.');
        }
        else if (!this.name) this.name = options.name;

        this.noteImageSize = options.noteImageSize || 288;

        if (options.array) { //Layout order provided
            this.array = options.array;

            if (options.random) throw new Error('Cannot set \'random\' flag when a pattern is provided.');
            if (options.numCols || options.numRows) throw new Error('Cannot set width or height of layout when a pattern is provided.');
            if (options.ratio) throw new Error('Cannot set aspect ratio of layout when a pattern is provided.');
        }
        else {
            this.array = await this.getPattern({
                rows:options.numRows,
                cols:options.numCols,
                ratio:options.ratio
            });
        }

        this.numRows = this.array.length;
        this.numCols = this.array[0].length;

        console.log('Successfully initialized layout from options.')

        return;
    }

    toDbObj() {
        return {
            _id:this._id,
            name: this.name,
            noteImageSize:this.noteImageSize,
            numRows:this.numRows,
            numCols:this.numCols,
            array: this.array,
            image: this.image,
        };
    }

    async insert() {
        throw new Error('Method \'insert()\' must be implemented.');
    }

    async getPattern() {
        throw new Error('Method \'getPattern()\' must be implemented.');
        // this method must return a valid 2D layout array to work properly:
    }

    async patchImage() {
        // TODO implement this: uploading a single note to an existing layout
    }

    async createImage(saveFiles) {
        console.log('Generating layout image...');
        const totalSteps = 2;

        const LAYOUT_DIR = TEMP_DIR+this.name;

        if (saveFiles && !fs.existsSync(`${LAYOUT_DIR}/`)) {
            fs.mkdirSync(`${LAYOUT_DIR}/`);
            console.log(`Created output directory ${LAYOUT_DIR}`);
        }

        console.log(`[STEP 1/${totalSteps}] Creating stitched image`);
        const stitchedTiff= await this.createStitchedImage(saveFiles);
        console.log(`[STEP 1/${totalSteps} DONE] Stitched image created.`);


        console.log(`[STEP 2/${totalSteps}] Generating DZI`);
        const image = dzi({
            name:this.name,
            saveFiles:saveFiles
        })
        image.init(stitchedTiff,() => {
            console.log(`[STEP 2/${totalSteps} DONE] DZI generated. ${saveFiles ? `Files saved to ${LAYOUT_DIR}.` : ''}`)
        })

        // 5. upload all dzi files to s3

        // 6. update layout object with dzi metadata and S3 URL

        // 7. insert layout object to mongo atlas
        if (saveFiles) {
            const jsonName = `${LAYOUT_DIR}/${this.name}-layout.json`;
            fs.writeFileSync(jsonName, JSON.stringify(this.toDbObj()));
            console.log(`Saved ${jsonName}`);
        }       
        // 8. delete temp files
        //process.exit();
    }

    async createStitchedImage(saveFile) {  
        
        const noteImageSize = this.noteImageSize;

        // Generate large blank image in temp folder
        let canvas = await sharp({
            create: {
                width:this.noteImageSize*this.numCols,
                height:this.noteImageSize*this.numRows,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        }).tiff().toBuffer();

        console.log('Beginning stitched image generation...');
        let y=0;
        let totalDone=0;
        const totalNotes = this.numRows * this.numCols;
        for (const row of this.array) {
            let x=0;
            for (const noteId of row) {
                try {
                    const noteObj = await getNoteById(noteId);

                    const image = await fetch(noteObj.orig);
                    const imageBuffer = await image.buffer();
                    const b64Resize = await sharp(imageBuffer).resize({width:noteImageSize}).jpeg().toBuffer();
                    
                    const thisNote = {
                        input: b64Resize,
                        top:y*noteImageSize,
                        left:x*noteImageSize
                    };
                    canvas = await sharp(canvas).composite([thisNote]).tiff().toBuffer();
                    console.log(`[${totalDone}/${totalNotes}] ${noteObj.thumb} added...`);

                    x+=1;
                    totalDone+=1;
                }
                catch (e) {
                    console.error(e);
                }
            }
            y+=1;
        }
        

        console.log('Pattern fully stitched.');

        if (saveFile) {
            const LAYOUT_DIR = TEMP_DIR+this.name;
            await sharp(canvas).toFile(`${LAYOUT_DIR}/${this.name}-stitched.tiff`, (err, info) => {
                console.log('Stitched image results: ',err,info);
            });
        }

        return canvas;
    }

}