import createLayout from "./create-layout.mjs";
import db from "../db/conn.mjs";

const makeDefaultLayout = async (options) => {

    let pattern;
    if (!options.fromDisk) pattern = await makeRandomPattern();
    else {console.log('using existing pattern.')}
    // 3. call createLayout with pattern
    console.log('Beginning layout creation...')
    createLayout(pattern, {
        name:options.name,
        saveFile:options.saveFile,
        fromDisk:options.fromDisk
    });
}

const makeRandomPattern = async () => {
    console.log('Creating random pattern...')
    // 1. list all note objects in 'notes' atlas collection
    let collection = await db.collection('notes');
    let allNotes = await collection.find({}).toArray();    
// Create random 2d array of note ids
    // 16/9 aspect ratio
    let totalNotes = allNotes.length;

// 320 / 111

    const ratio = 320/111;
    let height = Math.ceil(Math.sqrt(totalNotes/ratio));
    let width = Math.ceil(height*ratio);

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

    console.log(`New pattern generated.\nWidth:${pattern[0].length}\nHeight: ${pattern.length}`);

    return pattern;
}

makeDefaultLayout({
    saveFile:true,
    name:'stitched-1015-2'
});