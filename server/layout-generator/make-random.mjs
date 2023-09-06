import db from "../db/conn.mjs";

// Create random 2d array of note ids
export const makeRandomPattern = async (notes, options) => {

    console.log('Creating random pattern...')

    if (!notes) {
        // 1. list all note objects in 'notes' atlas collection
        console.log('No notes provided. Using all available notes by default.')
        const collection = await db.collection('notes');
        const allNoteIDs = (await collection.find({}).toArray()).map(note => note._id);
        notes = allNoteIDs;
    }

    const totalNotes = notes.length;

    let width, height;
    if (options.rows && options.cols) { // Use number of rows and cols if available
        width = options.cols;
        height = options.rows;
    }
    else { // Otherwise use a ratio instead (Default 16:9)
        const ratio = options.ratio ? options.ratio : 16/9;
        height = Math.ceil(Math.sqrt(totalNotes/ratio));
        width = Math.ceil(height*ratio);
    
        if ((width-2)*height >= totalNotes) width -= 2;
        if ((width-1)*height >= totalNotes) width -= 1;
        if (width*(height-1) >= totalNotes) height -= 1;
    }



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

// Get a set number of random note IDs
export const getRandomNoteIDs = async (count) => {
    const noteIDs = [];

    const collection = await db.collection('notes');

    const randomNotes = collection.aggregate([{$sample: {size:count}}]);

    for await (const noteObj of randomNotes) {
        noteIDs.push(noteObj._id);
    }

    return noteIDs;
}