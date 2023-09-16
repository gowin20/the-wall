import { listFolder } from "../../s3/s3.mjs";
import { insertFakeUser } from "../crud-users.mjs";
import note from "../../note/note.mjs";
import { getNoteByOrigUrl } from "../crud-notes.mjs";

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
const S3_URL = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';

export const createObjectsFromS3 = async (options) => {

    const notes = await listFolder(prefix);

    // Create list of note objects
    const noteIdList = [];
    for (const note of notes) {
        noteIdList.push(await parseNote(note));
    }

    console.log(noteIdList.length,'notes were inserted.');

    return noteIdList;
}

const initUserObject = async (nameAbbr) => {
    let userId;
    if (Object.keys(creators).includes(nameAbbr)) {
        userId = await insertFakeUser(creators[nameAbbr]);        
    }
    else {
        userId = await insertFakeUser("Unknown");
    }
    return userId;
}

const parseNote = async (path) => {

    if (path == 'notes/orig/') return;
    
    // get name of file without extension
    const noteName = path.substring(prefix.length,path.length-4);
    const extension = path.substring(path.length-4,path.length);

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
    const creatorId = await initUserObject(nameAbbr);

    const noteObject = {
        orig:S3_URL + path,
        creator: creatorId,
        title:null,
        details:info,
        location:place,
        date:dateAbbr
    }

    const existingNote = await getNoteByOrigUrl(noteObject.orig);
    let thisNote;
    if (existingNote) {
        console.log('NOTE EXISTS')
        thisNote = await note().fromId(existingNote._id);
    }
    else {
        console.log('NEW NOTE')
        thisNote = note().fromPacket(noteObject);
    }

    // The big step: creates note in system by uploading to S3, pregenerating tiles and thumbnail, and inserting to Mongo
    const noteId = await thisNote.create();
    console.log('Inserted ' + noteId);

    //return noteId;
}

await createObjectsFromS3();