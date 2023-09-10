import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const getAllUsers = async (id) => {
    const collection = db.collection('users');
    let results = await collection.find({}).toArray();
    return results;
}

export const getUserByID = async (id) => {
    const collection = db.collection('users');
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);

    return result;
}

// Returns a list of users that share a name (their actual real name, not username)
export const getUsersByName = async (name) => {
    const collection = db.collection('users');
    const result = await collection.find({name:name}).toArray();

    return result;
}


// Returns a user with a specific username (all usernames are unique!)
export const getUserByUsername = async (username) => {
    const collection = db.collection('users');
    const result = await collection.findOne({username:username});
    return result;
}

export const changeUsername = async (userID,newUsername) => {
    // TODO -- this option should only be provided to "fake users" who are converting to an actual account
}

export const changePassword = async (userID,newPassword) => {
    // TODO
}

// Inserts a "fake user" - someone who is credited as a note creator, but has not registered for an account
// Returns a user ID
export const insertFakeUser = async (userInfo) => {

    const collection = db.collection('users');

    let result;
    const userExists = await getUserByUsername(userInfo.username);
    if (userExists) {
        // A user by this name already exists. Return their info
        console.log('Found existing user:',userExists);
        return userExists._id;
    }

    const regex = /\ /g;
    const userObj = {
        _id: new ObjectId(),
        name: userInfo.name,
        username: userInfo.name.replace(regex,'-'),
        registered:false
    }
    console.log('Inserting new user:',userObj);
    result = await collection.insertOne(userObj);
    return result.insertedId;
}

export const insertUser = async (userInfo) => {
    // TODO

    const userObj = {
        _id: new ObjectId(),
        name: userInfo.name,
        registered:true,
        username:userInfo.username,
        password:userInfo.password // TODO HASH
    }

    return
}