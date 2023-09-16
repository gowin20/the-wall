import * as fs from 'fs';
import { getLayoutById, insertLayout } from '../../db/crud-layouts.mjs';
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
export const TEMP_LAYOUT_DIR = `./layout-generator/temp/`;

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

        const generate = (options.generate === undefined ? true : options.generate);
        
        if (generate) {
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

    /*
    {
        _id: the ObjectID of a layout in MongoDB. If true, ignores all other options except 'generate' and 'insert'
        generate: determines whether or not to generate an image (default true)
        insert: whether or not to upload layout files to S3 and MongoDB (default false)
        
        name: name of layout and output files. Required.
        noteImageSize: determines the size in pixels of each note in the layout (default 288)
        array: a 2D array determining layout order. If null, creates a random layout order
        numRows: number of rows in the random layout. Cannot pass when passing array
        numCols: number of columns in the random layout. Cannot pass when passing array
        ratio: the aspect ratio of the random layout. Cannot pass with array, numRows, or numCols
        saveFiles: whether or not to write layout files to disk (default false)
        outputType: the type of LayoutImage used to generate a layout (default DZIFromStitch)
    }

    */
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

            if ((options.numRows || options.numCols) && options.ratio) throw new Error('Cannot pass both numRows\/numCols and ratio.');
            if (!this.noteIds) throw new Error('No note IDs passed for random pattern generation.');

            const ASPECT_RATIO = this.ratio || options.ratio || 9/16;
            
            this.array = await this.makeRandomPattern({
                rows:options.numRows,
                cols:options.numCols,
                ratio:ASPECT_RATIO
            });
        }

        this.numRows = this.array.length;
        this.numCols = this.array[0].length;

        this.saveFiles = options.saveFiles || false;
        this.shouldInsert = options.insert || false;

        if (!options.outputType) this.outputType = 'DZIFromStitch';
        else if (options.outputType == 'stitch' || options.outputType == 'DZIFromStitch' || options.outputType == 'DZI') this.outputType = options.outputType;
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
            image: this.image
        };
    }

    async insert() {
        throw new Error('Method \'insert()\' must be implemented.');
    }

    async makeRandomPattern(options) {

        console.log('Creating random pattern...')
    
        if (!this.noteIds) throw new Error('No notes provided to \'makeRandomPattern()\'');
    
        const totalNotes = this.noteIds.length;
    
        let width, height;
        if (options.rows && options.cols) { // Use number of rows and cols if available
            width = options.cols;
            height = options.rows;
            // TODO edge case of "more notes than available space in layout"
        }
        else { // Otherwise use a ratio instead (Default 16:9)
            const ratio = options.ratio ? options.ratio : 16/9;
            height = Math.ceil(Math.sqrt(totalNotes/ratio));
            width = Math.ceil(height*ratio);
        
            if ((width-2)*height >= totalNotes) width -= 2;
            if ((width-1)*height >= totalNotes) width -= 1;
            if (width*(height-1) >= totalNotes) height -= 1;
        }
    
        const pattern = [];
        const usedNotes = new Set();
    
        for (let row=0;row<height;row++) {
            const thisRow = [];
            for (let col=0;col<width;col++) {
                if (usedNotes.size >= totalNotes) {
                    break;
                }
       
                let i;
                do {
                    i = Math.floor(Math.random()*totalNotes);
                } while (usedNotes.has(i));
        
                thisRow.push(this.noteIds[i])
                usedNotes.add(i);
            }
            pattern.push(thisRow);
        }
    
        console.log(`Width:${pattern[0].length}\nHeight: ${pattern.length}`);
        return pattern;
    }

    async createLayoutImage() {
        console.log('Generating layout image...');

        this.LAYOUT_DIR = TEMP_LAYOUT_DIR+this.name;
        

        if (this.saveFiles && !fs.existsSync(`${this.LAYOUT_DIR}/`)) {
            fs.mkdirSync(`${this.LAYOUT_DIR}/`);
            console.log(`Created output directory ${this.LAYOUT_DIR}`);
        }

        let imageObj;

        switch (this.outputType) {
            case 'DZI':
                throw new Error('DZI has not been implemented');
                imageObj = await dzi(this.toJson());
                break;
            case 'DZIFromStitch':
                console.log('[START] Creating DZI and stitched image...')
                imageObj = await dziFromStitch(this.toJson());
                break;
            case 'stitch':
                console.log(`[START] Creating stitched image...`);
                imageObj = await stitchedImage(this.toJson());
                break;
            default:
                throw new Error('Invalid output format provided to createLayoutImage')
        }

        await imageObj.init({saveFiles:this.saveFiles}, (imageObj) => {
            console.log(`[DONE] Layout image generated. ${this.saveFiles ? `Files saved to ${this.LAYOUT_DIR}.` : ''}`)
        })

        // Insert layout object to mongo atlas
        if (this.shouldInsert) {
            // Upload image files to S3
            console.log('[BEGIN S3 UPLOAD]');
            const imageUrl = await imageObj.uploadToS3();
            console.log(`Successfully uploaded DZI to ${imageUrl}`);
            // Insert image object into DB and retrieve ObjectId
            const imageId = await imageObj.insert();

            // 6. update layout object with dzi metadata and S3 URL
            this.image = imageId;

            const resId = await this.insert();
            console.log(`Successfully inserted layout to Atlas with ID ${resId}.`)
        }

        // Save layout JSON to disk
        if (this.saveFiles) {
            const jsonName = `${this.LAYOUT_DIR}/${this.name}-layout.json`;
            fs.writeFileSync(jsonName, JSON.stringify(this.toJson()));
            console.log(`Saved ${jsonName}`);
        }    
    }

    async patchImage() {
        // TODO implement this: uploading a single note to an existing layout
        // will need to implement 'DZI' class 'generate' and 'update' methods
    }

    async uploadLayout(path,options) {
        // TODO
    }
}