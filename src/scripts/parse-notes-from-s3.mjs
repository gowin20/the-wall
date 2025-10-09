import { listNewOrigNotes } from "../wall/s3.js";
import { insertFakeUser } from "../db/crud-users.js";
import note from "../wall/note.js";
import { getNoteByOrigUrl } from "../db/crud-notes.js";
import {CREATORS,LOCATIONS,DATES,TAGS} from './my-insanity';

/*
Note file naming scheme:
    - name_place_date_info_uid

ALWAYS has four underscores, even if a component isn't present.

examples:
    - go_kelton_2022_one-piece_7
    - om__23_text-only_0124
    - u____1243
    - ar_kelton__periodic-table_12
    - u_fuller_23__
*/

const LAST_UPLOAD_DATE = '2024-12-17';

/*
Workflow:
    1. Scan new notes IRL
    2. Crop notes and upload to S3 `notes/orig/` bucket
    3. Run this script
    4. Script finds all notes uploaded since the last upload date. Generates cached tiles for them, uploads everything to S3 + MongoDB
    5. In the money! Generate a new default layout to see results
*/

const prefix = 'notes/orig/';
const S3_ADDRESS = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';

export const createObjectsFromS3 = async (options) => {

    console.log('Step 1: Listing S3 /orig bucket...')
    const noteUrls = await listNewOrigNotes(LAST_UPLOAD_DATE);

    console.log(`Found ${noteUrls.length} new notes.`);
    console.log('Step 2: Parsing individual notes')
    const totalNotes=noteUrls.length;
    let i=1;
    // Create list of note objects
    const noteIdList = [];
    for (const note of noteUrls) {
        process.stdout.write(`[${i}/${totalNotes}] `)
        i++;
        noteIdList.push(await parseNote(note));
    }

    console.log(noteIdList.length,'notes were inserted.');

    return noteIdList;
}

const initUserObject = async (nameAbbr) => {
    let userId;
    if (Object.keys(CREATORS).includes(nameAbbr)) {
        userId = await insertFakeUser(CREATORS[nameAbbr]);        
    }
    else {
        userId = await insertFakeUser("Unknown");
    }
    return userId;
}



const parseNote = async (path) => {

    if (path == 'notes/orig/') return;

    const noteUrl = S3_ADDRESS + path;
    const existingNote = await getNoteByOrigUrl(noteUrl);


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
        place = (Object.keys(LOCATIONS).includes(components[1])) ? LOCATIONS[components[1]] : null;

        // Date section
        dateAbbr = (Object.keys(DATES).includes(components[2])) ? DATES[components[2]] : null;

        // Info section
        info = (Object.keys(TAGS).includes(components[3])) ? TAGS[components[3]] : null;
    }
    const creatorId = await initUserObject(nameAbbr);

    const noteObject = {
        orig:S3_ADDRESS + path,
        creator: creatorId,
        title:null,
        details:info,
        location:place,
        date:dateAbbr
    }

    let thisNote;
    if (existingNote) {
        console.log('Note already exists in Mongo!',path);
        thisNote = await note().fromId(existingNote._id);
    }
    else {
        console.log('New note:',noteUrl)
        // Create note object in local memory
        thisNote = note().fromPacket(noteObject);
    }
    // The big step: creates note in system by uploading to S3, pregenerating tiles and thumbnail, and inserting to Mongo
    const noteId = await thisNote.create();
    console.log('Inserted ' + noteId);

    //return noteId;
}

await createObjectsFromS3();