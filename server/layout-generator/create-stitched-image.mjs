import sharp from "sharp";
import * as fs from 'fs';
import db from "../db/conn.mjs";
import fetch from 'node-fetch';

const createStitchedImage = async (pattern,options) => {
    // Transpose 2D array to list of image objects w/ offsets
    let notesToStitch;

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
    else notesToStitch = await parsePattern(pattern,{
        noteImageSize:options.noteImageSize,
        saveFile:options.saveFile
    });

    console.log('pattern: ',notesToStitch);

    // Generate stitched image in temp folder
    await sharp({
        create: {
            width:options.noteImageSize*options.numCols,
            height:options.noteImageSize*options.numRows,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
    .composite(notesToStitch)
    .tiff()
    .toFile('./layout-generator/temp/stitched-temp.tiff', (err, info) => {
        console.log('Stitched image results: ',err,info);
    });
    return 1;
}

const parsePattern = async (pattern,options) => {
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