import db from "./conn.js"
import { ObjectId } from "mongodb";
//import bcrypt from 'bcrypt';

const Users = db.collection('users');

/*

Getters and setters

*/
export const getAllUsers = async ({alphabetical}) => {
    let results = await Users.find({}).toArray();
    if (alphabetical) {
        results = results.sort((a,b)=>{
            if (a.name < b.name) return -1 
            else return 1
        });
    }
    return results;
}

export const getUserByID = async (id) => {
    let query = {_id: new ObjectId(id)};
    let result = await Users.findOne(query);

    return result;
}

// Returns a list of users that share a name (their actual real name, not username)
export const getUsersByName = async (name) => {
    const result = await Users.find({name:name}).toArray();

    return result;
}

// Returns a user with a specific username (all usernames are unique!)
export const getUserByName = async (name) => {
    const result = await Users.findOne({name:name});
    return result;
}

export const getUserByUsername = async (username) => {
    const result = await Users.findOne({username:username});
    return result;
}

export const updateUserLayout = async (userId, layoutId) => {

    const result = await Users.updateOne({_id:new ObjectId(userId)}, {
        $set:{
            layout:new ObjectId(layoutId)
    }})
    console.log(`Updated ${result.modifiedCount} user records.`);
    return;
}

// Inserts a "fake user" - someone who is credited as a note creator, but has not registered for an account
// Returns a user ID
export const insertFakeUser = async (name) => {


    const userExists = await getUserByName(name);
    if (userExists) {
        // A user by this name already exists. Return their info
        //console.log('Found existing user:',userExists);
        return userExists;
    }

    const regex = /\ /g;

    const username = name.replace(regex,'-');
    const userObj = {
        name: name,
        username: username,
        registered:false
    }
    //console.log('Updating user:',userObj);
    const result = await Users.updateOne({username:username}, {
        $set: {
            ...userObj
        }
    }, {upsert:true});
    return {...userObj, _id:result.upsertedId};
}

export const checkAdmin = async (userId) => {
    const user = await getUserByID(userId);
    return user.isAdmin
}

/*

Authentication methods

*/
/*
TODO move bcrypt out of this file before uncommenting

export const registerUser = async (userInfo) => {

    if (!userInfo.username) return "No username provided.";
    if (!userInfo.password) return "No password provided.";
    if (!userInfo.email) return "No email provided.";

    const takenUsername = await Users.findOne({username:userInfo.username});
    if (takenUsername) {
        return "Username is taken.";
    }
    const takenEmail = await Users.findOne({email:userInfo.email});
    if (takenEmail) {
        return "Email address is already in use.";
    }
    const existingName = await Users.findOne({name:userInfo.name});
    if (existingName && existingName.registered) {
        return "An account for this person has already been created.";
    }

    const userObj = {
        name: userInfo.name,
        registered:true,
        username:userInfo.username.toLowerCase(),
        email:userInfo.email.toLowerCase(),
        password:await bcrypt.hash(userInfo.password,10)
    }

    if (existingName) {
        // update the existing user entry in DB instead of inserting new
        const result = await Users.updateOne({name:existingName.name},{
            $set: {...userObj}
        })
        console.log(`${result.matchedCount} users matched, ${result.modifiedCount} users updated.`)
    }
    else {
        const result = await Users.insertOne(userObj);
        console.log(`User ${result.insertedId} inserted.`);
    }
    return "OK"
}
*/

export const changeUsername = async (userID,newUsername) => {
    // TODO -- this option should only be provided to "fake users" who are converting to an actual account
}

export const changePassword = async (userID,newPassword) => {
    // TODO
}