//import db from "../db/conn.mjs";
import sharp from "sharp";
import * as fs from 'fs';
import createStitchedImage from "./create-stitched-image.mjs";
import createDZI from "./create-dzi.mjs";
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

const createLayout = async (pattern,options) => {

    const totalSteps = 3;
    console.log(`[STEP 1/${totalSteps}] Initializing layout...`);
    const LAYOUT_DIR = TEMP_DIR+options.name;

    if (pattern == null) {

        if (options.fromDisk) {
            console.log(`[STEP 1/${totalSteps}] Initializing layout from disk.`)
            const data = fs.readFileSync(`${LAYOUT_DIR}/layout.json`);
            pattern = await JSON.parse(data).array;
            console.log(`[STEP 1/${totalSteps}] Initializing read pattern from disk.`)
        }
        else {
            console.error('Error: a pattern is required to generate a layout.');
            return;
        }
    }
    else {
        console.log(`[STEP 1/${totalSteps}] Initializing layout from provided pattern.`)
    }

    // Initialize layout object
    const layout = {
        name:options.name,
        numRows:pattern.length,
        numCols:pattern[0].length,
        noteImageSize:288,
        array:pattern,
        dzi:null
    }

    if (options.saveFiles) {
        if (!fs.existsSync(`${LAYOUT_DIR}/`)) fs.mkdirSync(`${LAYOUT_DIR}/`);
    }
    console.log(`[STEP 1/${totalSteps} DONE] Successfully initialized layout with pattern.`);


    console.log(`[STEP 2/${totalSteps}] Creating stitched image`)
    const stitchedTiff= await createStitchedImage(layout,{
        fromDisk:options.fromDisk,
        saveFile:options.saveFiles
    })
    console.log(`[STEP 2/${totalSteps} DONE] Stitched image created.`);


    console.log(`[STEP 3/${totalSteps}] Generating DZI`)
    const dzi = await createDZI(stitchedTiff, {
        name:layout.name,
        saveFile:options.saveFiles
    });
    
    if (options.saveFiles) {
        await fs.writeFileSync(`${LAYOUT_DIR}/layout.json`, JSON.stringify(layout));
    }
    console.log(`[STEP 3/${totalSteps} DONE] DZI generated. ${options.saveFiles ? `Files saved to ${LAYOUT_DIR}.` : ''}`)

    // 5. upload all dzi files to s3

    // 6. update layout object with dzi metadata and S3 URL

    // 7. insert layout object to mongo atlas

    // 8. delete temp files
}

export default createLayout;