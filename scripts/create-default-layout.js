import { Layout, Art } from "gallery-image";
import { addThumbnail, getAllNotes } from '../db/crud-notes.mjs';
import { insertLayout } from "../db/crud-layouts.mjs";
import { uploadOrigToS3, uploadThumbnailToS3 } from "../s3/art.js";



const allNotes = await getAllNotes();
const thumbnailSize = 900;

// 900x900px is 300DPI for 3x3in post-it notes

const randNum = Math.floor(Math.random() * allNotes.length)
const note = allNotes[0];



const newNote = new Art({
    source: '../temp/test-note-coral.jpg',
    metadata: {
        creator: 'Gwen',
        title: 'Test note for testing!',
        details: 'Don\'t insert this into the database please.'
    }
});

const url = await uploadOrigToS3(newNote);

console.log(newNote);
console.log(url);







// generate layout
/*
const defaultLayout = new Layout({
    name: 'default-test-large-9-25-2025',
    artList: allNotes,
    noteImageSize: 1024,
    ratio: 19.5/9
})

await defaultLayout.generateImage({
    saveFile: true,
    outputDir: '../temp/',
    outputType: 'tif'
})

*/
// upload to s3


// insert layout