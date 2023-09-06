import sharp from "sharp";
import * as fs from 'fs';
import db from "../db/conn.mjs";
import fetch from 'node-fetch';
import { ObjectId } from "mongodb";
import { TEMP_DIR } from "./create-layout.mjs";

const createStitchedImage = async (layout,options) => {
    // Transpose 2D array to list of image objects w/ offsets
    
    /*
    if (options.fromDisk) {
        const data = fs.readFileSync('./layout-generator/temp/stitch-order.json', 'utf8');
        const file = await JSON.parse(data);
        notesToStitch = file.order;

        for (let i=0;i<notesToStitch.length;i++) {
            // Retrieve saved buffer from file
            const buffer = await Buffer.from(notesToStitch[i].input.data);
            notesToStitch[i].input = buffer;
        }
        console.log(notesToStitch)
        console.log('successfully read stitch order from disk.')
    }
    */
   
    const noteImageSize = layout.noteImageSize;

    // Generate large blank image in temp folder
    let canvas = await sharp({
        create: {
            width:noteImageSize*layout.numCols,
            height:noteImageSize*layout.numRows,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    }).tiff().toBuffer();

    let collection = await db.collection('notes');
    console.log('Beginning stitched image generation...');
    let y=0;
    let totalDone=0;
    const totalNotes = layout.array.length * layout.array[0].length;
    for (const row of layout.array) {
        let x=0;
        for (const noteID of row) {
            try {
                const noteObj = await collection.findOne({_id:new ObjectId(noteID)});

                const image = await fetch(noteObj.orig);
                const imageBuffer = await image.buffer();
                const b64 = await sharp(imageBuffer).resize({width:noteImageSize}).jpeg().toBuffer();
                
                const thisNote = {
                    input: b64,
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

    if (options.saveFile) {
        const LAYOUT_DIR = TEMP_DIR+layout.name;
        await sharp(canvas).toFile(`${LAYOUT_DIR}/${layout.name}-stitched.tiff`, (err, info) => {
            console.log('Stitched image results: ',err,info);
        });
    }

    return canvas;
}

const createImageBuffer = async (pattern,options) => {
    let collection = await db.collection('notes');
    const notesToStitch = [];
    let y=0;
    for (const row of pattern) {
        let x=0;
        for (const noteID of row) {
            try {
                const noteObj = await collection.findOne({_id:noteID});
                const image = await fetch(noteObj.thumb);
                const imageBuffer = await image.buffer();
                const b64 = await sharp(imageBuffer).toBuffer();
                console.log(noteObj.thumb +' fetched');
                const thisNote = {
                    input: b64,
                    top:y*options.noteImageSize,
                    left:x*options.noteImageSize
                };
                console.log(thisNote);
                notesToStitch.push(thisNote);
                x+=1;
            }
            catch (e) {
                console.error(e);
            }
        }
        y+=1;
    }
    
    if (options.saveFile) {
        await fs.writeFileSync('./layout-generator/temp/stitch-order.json',JSON.stringify({order:notesToStitch}))
        console.log('transposed pattern saved');
    }
    console.log('pattern transposed');
    return notesToStitch;
}


export default createStitchedImage;