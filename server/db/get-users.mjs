import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const getAllUsers = async (id) => {
    let collection = await db.collection('users');
    let results = await collection.find({}).toArray();
    return results;
}

export const getUserByID = async (id) => {
    let collection = await db.collection('users');
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);

    return result;
}

export const getUserByName = async (name) => {
    return;
}

export const getUserByUsername = async (username) => {
    return;
}