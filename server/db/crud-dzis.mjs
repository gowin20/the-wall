import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const insertDzi = async (dziObj) => {
    let collection = db.collection('dzis');

    if (!dziObj) throw new Error('No DZI object provided.');
    if (!dziObj.name) throw new Error('All DZIs must have a name (the name of their layout + \'-dzi\').');
    if (!dziObj.Image.Url) throw new Error('Cannot insert a DZI without an associated S3 folder');

    dziObj._id = new ObjectId();
    await collection.updateOne({name:dziObj.name},{
        $set: {
            ...dziObj
        }},
        {upsert:true}
    );

    return dziObj._id;
}