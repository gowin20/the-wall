import db from "../db/conn.mjs";
import createLayout from "./create-layout.mjs";

const makeDefaultLayout = async () => {

    // 1. list all note objects in 'notes' atlas collection
    let collection = await db.collection('notes');
    let allNotes = await collection.find({}).toArray();

    // 2. create random 2d array of note ids
    // 16/9 aspect ratio
    let totalNotes = allNotes.length;

    const ratio = 16/9;
    const height = Math.ceil(Math.sqrt(totalNotes/ratio));
    const width = Math.ceil(height*ratio);

    if ((width-2)*height >= totalNotes) width -= 2;
    if ((width-1)*height >= totalNotes) width -= 1;
    if (width*(height-1) >= totalNotes) height -= 1;

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
    
            thisRow.push(allNotes[i]._id)
            usedNotes.add(i);
        }
        pattern.push(thisRow);
    }

    console.log('pattern complete. width:',pattern[0].length,'height:',pattern.length);

    // 3. call createLayout with pattern
    //createLayout(pattern);
}

makeDefaultLayout();