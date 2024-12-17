import db from './conn.mjs';
import { ObjectId } from 'mongodb';

export const insertOrUpdateDzi = async (dziObj) => {
    let collection = db.collection('dzis');

    if (!dziObj) throw new Error('No DZI object provided.');
    if (!dziObj.name) throw new Error('All DZIs must have a name (the name of their layout + \'-dzi\').');
    if (!dziObj.Image.Url) throw new Error('Cannot insert a DZI without an associated S3 folder');

    delete dziObj._id;

    const dziExists = await collection.findOne({name:dziObj.name});
    if (dziExists) {
        await collection.updateOne({name:dziObj.name},{
            $set: {
                ...dziObj
            }},
        );
        return dziExists._id;
    }
    else {
        const result = await collection.insertOne(dziObj);
        return result.insertedId;
    }
}

export const insertNewDzi = async (dziObj) => {
    let collection = db.collection('dzis');

    if (!dziObj) throw new Error('No DZI object provided.');
    if (!dziObj.name) throw new Error('All DZIs must have a name (the name of their layout + \'-dzi\').');
    if (!dziObj.Image.Url) throw new Error('Cannot insert a DZI without an associated S3 folder');

    //dziObj._id = new ObjectId();

    delete dziObj._id;
    //await collection.insertOne(dziObj);
    const resultId = await collection.insertOne(dziObj);

    return resultId;
}

export const getDziIdByName = async (dziName) => {
    const collection = db.collection('dzis');
    const result = await collection.findOne({name:dziName});

    if (!result) throw new Error('Invalid DZI name.');
    return result._id;
}

export const getDziById = async (dziId) => {
    let collection = db.collection('dzis');
    let query = {_id: new ObjectId(dziId)};
    let result = await collection.findOne(query);
    return result;
}

export const getAllDzis = async () => {
    let collection = db.collection('dzis');
    let results = await collection.find({}).toArray();
    return results;
}