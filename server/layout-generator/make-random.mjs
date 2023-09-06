import db from "../db/conn.mjs";

export const makeRandomPattern = async (notes, options) => {

    console.log('Creating random pattern...')

    if (!notes) {
        // 1. list all note objects in 'notes' atlas collection
        console.log('No notes provided. Using all available notes by default.')
        const collection = await db.collection('notes');
        const allNoteIDs = (await collection.find({}).toArray()).map(note => note._id);
        notes = allNoteIDs;
    }

// Create random 2d array of note ids
    // 16/9 aspect ratio
    let totalNotes = notes.length;

// 320 / 111

    const ratio = options.ratio ? options.ratio : 16/9;
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
    
            thisRow.push(notes[i])
            usedNotes.add(i);
        }
        pattern.push(thisRow);
    }

    console.log(`New pattern generated.\nWidth:${pattern[0].length}\nHeight: ${pattern.length}`);
    return pattern;
}

export const getRandomNotes = async (count) => {
    const noteIDs = [];

    const collection = await db.collection('notes');

    const randomNotes = collection.aggregate([{$sample: {size:count}}]);

    for await (const noteObj of randomNotes) {
        noteIDs.push(noteObj._id);
    }

    return noteIDs;
}