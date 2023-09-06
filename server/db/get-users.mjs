import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const getUserByID = async (id) => {
    let collection = await db.collection('users');
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);

    return result;
}