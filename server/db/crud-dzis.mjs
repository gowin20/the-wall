import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const insertDzi = async (dziObj) => {
    let collection = db.collection('dzis');

    if (!dziObj) throw new Error('No DZI object provided.');
    if (!dziObj.name) throw new Error('All DZIs must have a name (the name of their layout + \'-dzi\').');
    if (!dziObj.Image.Url) throw new Error('Cannot insert a DZI without an associated S3 folder');

    //dziObj._id = new ObjectId();

    delete dziObj._id;
    //await collection.insertOne(dziObj);
    const result = await collection.updateOne({name:dziObj.name},{
        $set: {
            ...dziObj
        }},
        {upsert:true}
    );

    return result.upsertedId;
}

export const getDziIdByName = async (dziName) => {
    const collection = db.collection('dzis');
    const result = await collection.findOne({name:dziName});

    if (!result) throw new Error('Invalid DZI name.');
    return result._id;
}