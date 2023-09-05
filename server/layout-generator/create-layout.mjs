//import db from "../db/conn.mjs";
import sharp from "sharp";
import * as fs from 'fs';
import createStitchedImage from "./create-stitched-image.mjs";
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
const createLayout = async (pattern,options) => {

    if (pattern == null) {

        if (options.fromDisk) {
            const data = fs.readFileSync('./layout-generator/temp/layout.json');
            pattern = await JSON.parse(data).array;
            console.log('successfully read existing pattern from disk.');
        }
        else {
            console.error('Error: a pattern is required to generate a layout.');
            return;
        }
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
    console.log('layout initialized')

    await createStitchedImage(pattern,{
        noteImageSize:layout.noteImageSize,
        numRows:layout.numRows,
        numCols:layout.numCols,
        fromDisk:options.fromDisk,
        saveFile:options.saveFile
    })
    console.log('stitched image (prob) created');

    // Generate dzi directory in temp folder
    await sharp('./layout-generator/temp/stitched-temp.tiff')
    .jpeg()
    .tile({
        size:576
    })
    .toFile('./layout-generator/temp/dzi-output.dz', (err, info) => {
        console.log(err,info)
    })
    
    if (options.saveFile) {
        await fs.writeFileSync('./layout-generator/temp/layout.json', JSON.stringify(layout));
    }
    console.log('process complete. file saved.')

    // 5. upload all dzi files to s3

    // 6. update layout object with dzi metadata and S3 URL

    // 7. insert layout object to mongo atlas

    // 8. delete temp files
}

export default createLayout;