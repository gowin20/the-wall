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

export const getAllNotes = async (noteID) => {
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


export const insertNote = async (noteObj) => {
    const collection = db.collection('notes');

    const S3_URL = new RegExp('https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/notes\/orig\/');
    const errorHeader = 'INSERT ERROR: ';
    // All notes need a valid creator ID and a valid URL
    if (!noteObj) {
        console.error(`${errorHeader}No note provided.`);
    }
    else if (!noteObj.URL) {
        console.error(`${errorHeader}No image URL.`);
    }
    else if (!S3_URL.test(noteObj.URL)) {
        console.error(`${errorHeader}Invalid S3 URL.`);
    }
    else if (!noteObj.creatorId) {
        console.error(`${errorHeader}No creator ID.`);
    }
    else if (!(await getUserByID(noteObj.creatorId))) {
        console.error(`${errorHeader}Invalid creator ID.`);
    }


    // create a well-formatted note object from input
    const validNoteObj = {
        _id: new ObjectId(),
        orig: noteObj.URL,
        creatorId: noteObj.creatorId,
        title: noteObj.title,
        description: noteObj.description,
        location: noteObj.location,
        date: noteObj.date
    }


    // if URL already exists in system, update existing note
    console.log(noteObj._id);
    const result = await collection.insertOne(validNoteObj);
    console.log('Successfully inserted note: ',result.insertedId);

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


export const updateNote = async (id,info) => {

    const updateInfo = {
        $set: {

        }
    }
}