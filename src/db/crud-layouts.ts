import db from "./conn.js"
import { ObjectId } from "mongodb";

// Returns an object containing all layouts
export const getAllLayouts = async () => {
    let collection = await db.collection('layouts');
    let results = await collection.find({}).toArray();
    return results;
}

// Returns a layout object by searching with an ObjectId
export const getLayoutById = async (layoutId) => {
    let collection = await db.collection('layouts');
    let query = {_id: new ObjectId(layoutId)};
    let result = await collection.findOne(query);

    return result;
}

// Returns a layout ID by searching with the 'name' property. Assumes layout names are unique.
export const getLayoutIdByName = async (layoutName) => {
    const collection = await db.collection('layouts');
    const result = await collection.findOne({name:layoutName});

    if (!result) throw new Error('Invalid layout name.');
    return result._id;
}

// Inserts a layout to MongoDB
export const insertLayout = async (layoutObj) => {

    const S3_ADDRESS = new RegExp('https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/notes\/orig\/');
    const errorHeader = 'INSERT ERROR: ';
    // all layout objects must have:

    // `name` prop (string)
    // `noteImageSize` prop: size of each note on grid in pixels, default 288
    // `array` prop (2D array containing note IDs)
    // `image` prop pointing to valid S3 image folder

    if (!layoutObj) {
        throw new Error(`No layout object provided.`);
    }
    else if (!layoutObj.name) {
        throw new Error(`No layout name provided.`);
    }

    const collection = await db.collection('layouts');

    //layoutObj._id = new ObjectId();
    delete layoutObj._id;

    const result = await collection.updateOne({name:layoutObj.name},{
        $set: {
            ...layoutObj
        }},
        {upsert:true}
    );

    // TODO
    return result.upsertedId;
}