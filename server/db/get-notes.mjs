import db from "./conn.mjs"
// A collection of functions returning notes

export const getNotesByUser = async (userID) => {
    const notes = []

    const noteColl = db.collection('notes');

    const res = noteColl.find( {
        creator:userID
    })

    for await (const note of res) {
        notes.push(note);
    }
    
    return notes
}

// Get a set number of random note IDs
export const getRandomNotes = async (count) => {
    const notes = [];

    const collection = await db.collection('notes');

    const randomNotes = collection.aggregate([{$sample: {size:count}}]);

    for await (const noteObj of randomNotes) {
        notes.push(noteObj);
    }

    return notes;
}