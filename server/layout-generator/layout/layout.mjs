import * as fs from 'fs';
import sharp from "sharp";
import fetch from 'node-fetch';
import { getLayoutById, insertLayout } from '../../db/crud-layouts.mjs';
import { getNoteById } from "../../db/crud-notes.mjs";
import dzi from '../image/dzi.mjs';
import stitchedImage from '../image/stitchedImage.mjs';
import dziFromStitch from '../image/dziFromStitch.mjs';

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
            await this.createLayoutImage(options.saveFiles,true);
        }
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

        this.saveFiles = options.saveFiles || false;
        this.shouldInsert = options.insert || false;

        if (!options.outputType) this.outputType = 'DZIfromStitch';
        else if (options.outputType == 'stitch' || options.outputType == 'DZIfromStitch' || options.outputType == 'DZI') this.outputType = options.outputType;
        else throw new Error('Invalid input to param `outputType`.')

        console.log('Successfully initialized layout from options.')

        return;
    }

    toJson() {
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
        // will need to implement 'DZI' class 'generate' and 'update' methods
    }

    async uploadLayout(path,options) {
        // TODO
    }

    async createLayoutImage() {
        console.log('Generating layout image...');

        this.LAYOUT_DIR = TEMP_DIR+this.name;
        

        if (this.saveFiles && !fs.existsSync(`${this.LAYOUT_DIR}/`)) {
            fs.mkdirSync(`${this.LAYOUT_DIR}/`);
            console.log(`Created output directory ${this.LAYOUT_DIR}`);
        }

        let imageObj;

        switch (this.outputType) {
            case 'DZI':
                imageObj = await this.createDzi();
                break;
            case 'DZIfromStitch':
                imageObj = await this.createDziFromStitch();
                break;
            case 'stitch':
                imageObj = await this.createStitchedImage();
                break;
            default:
                throw new Error('Invalid output format provided to createLayoutImage')
        }

        // Upload image files to S3
        await imageObj.uploadToS3();
        // Insert image object into DB and retrieve ObjectId
        const imageId = await imageObj.insert();

        // 6. update layout object with dzi metadata and S3 URL
        this.image = imageId;

        // Insert layout object to mongo atlas
        if (this.shouldInsert) {
            await this.insert();
        }

        // Save layout JSON to disk
        if (this.saveFiles) {
            const jsonName = `${this.LAYOUT_DIR}/${this.name}-layout.json`;
            fs.writeFileSync(jsonName, JSON.stringify(this.toJson()));
            console.log(`Saved ${jsonName}`);
        }    
    }

    async createStitchedImage() {

        console.log(`[START] Creating stitched image...`);

        const imageObj = await stitchedImage(this.toJson());
        await imageObj.init({saveFile:this.saveFiles}, (stitch) => {

        });
        console.log(`[DONE] Stitched image created.`);

        return imageObj;
    }

    async createDzi() {
        throw new Error('DZI has not been implemented');
        // TODO implement dzi generation without stitched image
        const imageObj = await dzi(this.toJson());
        await imageObj.init({saveFiles:this.saveFiles},() => {
            console.log(`[DONE] DZI generated. ${this.saveFiles ? `Files saved to ${this.LAYOUT_DIR}.` : ''}`)
        })
        return imageObj;
    }

    async createDziFromStitch() {
        
        console.log('[START] Creating DZI and stitched image...')

        const imageObj = await dziFromStitch(this.toJson());
        await imageObj.init({saveFiles:this.saveFiles}, (dzi) => {
            console.log(`[DONE] DZI generated. ${this.saveFiles ? `Files saved to ${this.LAYOUT_DIR}.` : ''}`)
        })
        return imageObj;
    }

}