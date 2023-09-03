import { listNotes } from "../query-s3.mjs";
import { ObjectId } from "mongodb";
import db from './conn.mjs';
import * as fs from 'fs';

const creators = {
    'go':'George Owen',
    'ar':'Armin Taheri',
    'om':'Oliver Melgrove',
    'tw':'Tate Welty',
    'my':'Matt Yim',
    'sc':'Shreya Chatterjee',
    'ushi':'Nick Ushiyama',
    'n':'Unknown',
    'josh-rice':'Joshua Rice',
    'athya':'Athya',
    'anvita':'Anvita',
    'alex-blowers':'Alex Blowers',
    'nick-wenger':'Nick Wenger',
    'david-song':'David Song',
    'ella':'Ella Chen',
    'fionna':'Fionna Shue',
    'hunter-newell':'Hunter Newell',
    'jawan':'Jawan Ali',
    'kim-chen':'Kim Chen',
    'keeg':'Keegan Sarnecki',
    'kristin-ishaya':'Kristin Ishaya',
    'laura-658':'Laura from 658',
    'mia-owen':'Mia Owen',
    'margo':'Margo Owen',
    'morgan-silverman':'Morgan Silverman',
    'multiple':'Multiple authors',
    'evan-mukherji':'Evan Mukherji',
    'sophie':'Sophie',
    'tom':'Tom'
}

const locations = {
    'kt':'Kelton Ave',
    'hd':'Hedrick Hall',
    'chi':'Chicago',
    'na':'Nashville'
}

const dates = {
    'mar22':'March 2022',
    'may23':'May 2023',
    'may':'May 2022',
    'jan22':'January 2022',
    'oct20':'October 2020',
    'jun21':'June 2021',
    'jul21':'July 2021'
}

const tags = {
    'en':'English',
    'en-game':['English','game'],
    'hi':'Hindi',
    'ja':'Japanese',
    'fr':'French',
    'txt':'texture',

}
const prefix = 'notes/orig/';
const origURL = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/orig/';
const thumbURL = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/96ppi/';

const userObjects = {};


export const createObjectsFromS3 = async (options) => {
    const saveFile = options.saveFile || false;

    const notes = await listNotes({
        saveFile:saveFile,
        folder:prefix
    });

    // Create list of note objects
    const noteObjectList = [];
    for (const note of notes) {
        noteObjectList.push(createNoteObject(note));
    }

    // Create list of user objects
    const userObjectList = []
    Object.keys(userObjects).forEach(user => {
        userObjectList.push(userObjects[user]);
    })

    const output = {
        notes: noteObjectList,
        users: userObjectList
    }
    if (saveFile) fs.writeFileSync('../temp/parsed-output.json',JSON.stringify(output));
    return output;
}

const createUserObject = (nameAbbr) => {
    if (Object.keys(creators).includes(nameAbbr)) {
        const name = creators[nameAbbr];
        if (!Object.keys(userObjects).includes(name)) {
            userObjects[name] = {
                _id:new ObjectId(), // manually generate ObjectID to reference in NoteObjects
                name:name,
                registered:false
            }
        }
        return userObjects[name]._id.toHexString();
    }
    else {
        return null;
    }
}

const createNoteObject = (path) => {
    
    // get name of file without extension
    const noteName = path.substring(prefix.length,path.length-4);

    // split name into components
    const components = noteName.split('_');

    // parse data from name
    let nameAbbr,place,dateAbbr,info;
    if (components.length == 5) {

        // Name section handled by createUserObject
        nameAbbr = components[0];

        // Location section
        place = (Object.keys(locations).includes(components[1])) ? locations[components[1]] : null;

        // Date section
        dateAbbr = (Object.keys(dates).includes(components[2])) ? dates[components[2]] : null;

        // Info section
        info = (Object.keys(tags).includes(components[3])) ? tags[components[3]] : null;
    }

    const noteObject = {
        orig:origURL + noteName + '.tif',
        thumb:thumbURL + noteName + '_thumb.jpeg',
        creator: createUserObject(nameAbbr),
        title:null,
        details:info,
        location:place,
        date:dateAbbr
    }

    return noteObject;
}


// don't run this again
const insertDBObjects = async () => {

    const objects = await createObjectsFromS3({});
    console.log('Parsed objects from S3');

    const users = objects.users;
    const userCollection = db.collection('users');
    //already ran this
    //const userResult = await userCollection.insertMany(users, {ordered:true});
    console.log(`${userResult.insertedCount} users were inserted`)

    const notes = objects.notes;
    const noteCollection = db.collection('notes');
    
    //already ran this
    //const noteResult = await noteCollection.insertMany(notes, {ordered:true});
    console.log(`${noteResult.insertedCount} notes were inserted`)

    console.log('done.');
    return;
}