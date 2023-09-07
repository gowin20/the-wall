import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const getAllLayouts = async () => {
    let collection = await db.collection('layouts');
    let results = await collection.find({}).toArray();
    return results;
}

export const getLayoutById = async (layoutId) => {
    let collection = await db.collection('layouts');
    let query = {_id: new ObjectId(layoutId)};
    let result = await collection.findOne(query);

    return result;
}

export const getDefaultLayout = async () => {
    let collection = await db.collection('layouts');
    let query = {default:true};
    let result = await collection.findOne(query); // There should only ever be ONE layout with default:true

    return result;
}