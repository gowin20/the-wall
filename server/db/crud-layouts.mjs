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

export const insertLayout = async (layout) => {

    const S3_URL = new RegExp('https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/notes\/orig\/');
    const errorHeader = 'INSERT ERROR: ';
    // all layout objects must have:

    // `name` prop (string)
    // `noteImageSize` prop: size of each note on grid in pixels, default 288
    // `array` prop (2D array containing note IDs)
    // `image` prop pointing to valid S3 image folder

    if (!layout) {
        console.error(`${errorHeader}No layout object provided.`);
    }
    else if (!layout.name) {
        console.error(`${errorHeader}No layout name provided.`);
    }

    // TODO
    return;
}