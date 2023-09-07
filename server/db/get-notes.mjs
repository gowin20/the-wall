import db from "./conn.mjs"
import { ObjectId } from "mongodb";

// A collection of functions returning notes
export const getNoteById = async (noteID) => {
    let collection = await db.collection('notes');
    let query = {_id: new ObjectId(noteID)};
    let result = await collection.findOne(query);
    return result;
}

export const getAllNotes = async (noteID) => {
    let collection = await db.collection('notes');
    let results = await collection.find({}).toArray();
    return results;
}


export const getNotesByUser = async (userID) => {
    const noteColl = db.collection('notes');
    const notes = noteColl.find({creator:userID}).toArray();
    return notes; 
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