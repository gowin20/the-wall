import { Layout, Art } from "gallery-image";
import { addThumbnail, getAllNotes, getNoteById } from '../db/crud-notes.mjs';
import { insertLayout } from "../db/crud-layouts.mjs";
import { uploadOrigToS3, uploadThumbnailToS3 } from "../s3/art.js";

// generate layout

const allNotes = await getAllNotes();
const artList = allNotes.map(note => {
    try { return new Art(note) } catch (e) {
        console.log('BROKEN NOTE');
        console.log(note);
    }
});

const defaultLayout = new Layout({
    name: 'default-9-29-2025',
    artList: artList,
    noteImageSize: 900,
    ratio: 19.5/9
});
//console.log(defaultLayout);

await defaultLayout.generateImage({
    saveFile: true,
    outputDir: '../temp/',
    outputType: 'tif',
    sharpOptions: {
        limitInputPixels: false
    },
    logLevel: 'standard'
});

console.log('Done.');

// upload to s3
// insert layout