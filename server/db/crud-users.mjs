import db from "./conn.mjs"
import { ObjectId } from "mongodb";

export const getAllUsers = async () => {
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
export const getUserByName = async (name) => {
    const collection = db.collection('users');
    const result = await collection.findOne({name:name});
    return result;
}

export const changeUsername = async (userID,newUsername) => {
    // TODO -- this option should only be provided to "fake users" who are converting to an actual account
}

export const changePassword = async (userID,newPassword) => {
    // TODO
}

export const updateUserLayout = async (userId, layoutId) => {
    const collection = db.collection('users');

    const result = await collection.updateOne({_id:new ObjectId(userId)}, {
        $set:{
            layout:new ObjectId(layoutId)
    }})
    console.log(`Updated ${result.modifiedCount} user records.`);
    return;
}

// Inserts a "fake user" - someone who is credited as a note creator, but has not registered for an account
// Returns a user ID
export const insertFakeUser = async (name) => {

    const collection = db.collection('users');

    const userExists = await getUserByName(name);
    if (userExists) {
        // A user by this name already exists. Return their info
        //console.log('Found existing user:',userExists);
        return userExists._id;
    }

    const regex = /\ /g;

    const username = name.replace(regex,'-');
    const userObj = {
        name: name,
        username: username,
        registered:false
    }
    //console.log('Updating user:',userObj);
    const result = await collection.updateOne({username:username}, {
        $set: {
            ...userObj
        }
    }, {upsert:true});
    return result.upsertedId;
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