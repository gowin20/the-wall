import fs from 'fs';
import { getNoteByOrigUrl } from './crud-notes.mjs';
import db from './conn.mjs'


const renameTifToPng = async () => {
    const INPUT_DIR = '../../images/notes/2-staged/';
    const filenames = fs.readdirSync(INPUT_DIR);

    console.log(filenames.length);
    const collection = db.collection('notes');

    filenames.forEach(async file => {

        const S3_PREFIX = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/orig/';

        const imageName = file.substring(0,file.length-4);
        const oldUrl = S3_PREFIX+imageName + '.tif';
        const newUrl = S3_PREFIX+file;

        const filter = {
            orig: oldUrl
        };
        const updateInfo = {
            $set: {
                orig: newUrl
            }
        }

        const result = await collection.updateOne(filter,updateInfo);

        console.log(result.matchedCount+' docs found, updated '+result.modifiedCount+' docs.');
    })
}