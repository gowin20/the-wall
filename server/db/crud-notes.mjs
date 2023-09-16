import db from "./conn.mjs"
import { ObjectId } from "mongodb";
import { getUserByID } from "./crud-users.mjs";

// A collection of functions returning notes
export const getNoteById = async (noteID) => {
    let collection = db.collection('notes');
    let query = {_id: new ObjectId(noteID)};
    let result = await collection.findOne(query);

    return result;
}

export const getNoteByOrigUrl = async (noteUrl) => {
    let collection = db.collection('notes');
    let query = {orig: noteUrl};
    let result = await collection.findOne(query);

    return result;
}

export const getAllNotes = async () => {
    let collection = db.collection('notes');
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

    const collection = db.collection('notes');

    const randomNotes = collection.aggregate([{$sample: {size:count}}]);

    for await (const noteObj of randomNotes) {
        notes.push(noteObj);
    }

    return notes;
}

export const updateNote = async (noteObj) => {
    const collection = db.collection('notes');

    if (!noteObj._id) throw new Error('Cannot update DB note without a valid ObjectID');

    const {_id, ...noteInfo} = noteObj;
    const result = await collection.updateOne({_id:new ObjectId(_id)}, {
        $set: {
            ...noteInfo
        }
    })

    console.log(`Updated Atlas note: ${result}`);
}

export const insertNewNote = async (noteObj) => {
    const collection = db.collection('notes');

    const S3_URL = new RegExp('https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/notes\/orig\/');
    const errorHeader = 'INSERT ERROR: ';
    // All notes need a valid creator ID and a valid URL
    if (!noteObj) {
        console.error(`${errorHeader}No note provided.`);
    }
    else if (!noteObj.orig) {
        console.error(`${errorHeader}No image URL.`);
    }
    else if (!S3_URL.test(noteObj.orig)) {
        console.error(`${errorHeader}Invalid S3 URL.`);
    }
    else if (!noteObj.creatorId) {
        console.error(`${errorHeader}No creator ID.`);
    }
    else if (!(await getUserByID(noteObj.creatorId))) {
        console.error(`${errorHeader}Invalid creator ID.`);
    }

    const result = await collection.insertOne(noteObj);
    console.log('Successfully inserted NEW note: ',result.insertedId);

    return result;
}

export const addThumbnail = async (id,thumbnailName,url) => {
    const note = await getNoteById(id);
    const updateThumbs = {
        $set: {
            thumbnails: {
                ...note.thumbnails,
                [thumbnailName]:url
            }
        }
    }
    const notes = db.collection('notes');
    const result = notes.updateOne({_id:new ObjectId(id)}, updateThumbs);

    if (result.matchedCount == 0) throw new Error('Invalid note ID.');

    return result;
}

export const insertNotesBulk = async (notes) => {
    // TODO (not really necessary though)
    return;
}