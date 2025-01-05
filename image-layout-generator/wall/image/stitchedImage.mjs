import note from "../note.mjs";
import { TEMP_LAYOUT_DIR } from "../layout/layout.mjs";
import { LayoutImage } from "./layoutImage.mjs";
import sharp from "sharp";
import fetch from 'node-fetch';

class StitchedImage extends LayoutImage {

    constructor(layout) {
        super(layout);
        this.name = `${layout.name}-stitch`;
        this.LOCAL_DIR = TEMP_LAYOUT_DIR+layout.name+'/';
    }

    async init(options,callback) {
        await this.generate(options.saveFile);
        callback.bind(this)();
    }

    async generate(saveFile) {
        const noteImageSize = this.layout.noteImageSize;
        const thumbnailName = this.thumbnailName;

        console.log('Beginning stitched image generation...');
        let y=0;
        let totalDone=0;
        const totalNotes = this.layout.numRows * this.layout.numCols;

        const buffs = [];

        for (const row of this.layout.array) {
            let x=0;
            for (const noteId of row) {
                // Every 10 times this runs is approx. 45s
                try {
                    const noteObj = note();
                    await noteObj.fromId(noteId);
                    
                    
                    if (!noteObj.thumbnailExists(noteImageSize)) {
                        console.log(`Size ${noteImageSize} thumbnail of ${noteObj.orig} does not exist, creating it...`)
                        await noteObj.createThumbnail(noteImageSize,true);

                        await noteObj.fromId(noteId);
                    }
                    
                    const thumbnailImage = await fetch(noteObj.getThumbnail(noteImageSize));

                    const imageBuffer = await thumbnailImage.buffer();
                    
                    const thisNote = {
                        input: imageBuffer,
                        top:y*noteImageSize,
                        left:x*noteImageSize
                    };
                    
                    buffs.push(thisNote);
                    console.log(`[${totalDone}/${totalNotes}] ${noteObj.thumbnails[thumbnailName]} fetched...`);

                    x+=1;
                    totalDone+=1;
                }
                catch (e) {
                    console.error(e);
                }
            }
            y+=1;
        }

        console.log('All fetched. Stitching all notes...')
        // Generate large blank image in temp folder
        let canvas = await sharp({
            create: {
                width:noteImageSize*this.layout.numCols,
                height:noteImageSize*this.layout.numRows,
                channels: 4,
                background: { r: 48, g: 48, b: 48, alpha: 1 } // #303030 - same as site background
            }
        }).composite(buffs).tiff().toBuffer();

        console.log('Pattern fully stitched.');

        if (saveFile) {
            const res = await sharp(canvas).toFile(`${this.LOCAL_DIR}${this.name}.tiff`);
            console.log(`Resulting image: ${res}`)
        }
        this.buffer = canvas;
    }

    async insert() {
        throw new Error('Database does not currently support stitched images.')
        return;
    }

    async uploadToS3() {
        throw new Error('S3 bucket does not currently support stitched images.');
        return;        
    }

    getBuffer() {
        return this.buffer;
    }
}

const stitchedImage = async (layout) => {
    return new StitchedImage(layout);
}

export default stitchedImage;