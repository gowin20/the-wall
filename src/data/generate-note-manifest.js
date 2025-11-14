import {Art} from 'gallery-image';
import allNotes from './mongo-export/all-notes.json' with {type:'json'};
import allUsers from './mongo-export/all-users.json' with {type:'json'};
import allNotesManifest from './all-notes/manifest.json' with {type:'json'};
import { writeFileSync } from 'fs';

/*
Goal:
output manifest.json compliant with IIIF presentation API v3

The manifest.json includes ALL INDIVIDUAL NOTES

this is a manifest of NOTES

then we'll make a second manifest of the MAIN IMAGE

*/

const getNoteById = (artId) => {
    for (const art of allNotes) {
        if (art._id === artId) return art;
    }
    return null;
}
const getUserById = (userId) => {
    for (const user of allUsers) {
        if (user._id === userId) return user;
    }
    return null;
}

const URL_PREFIX = "https://wall.gowen.dev/api/iiif/3"
const ID = "all-notes";

const creators = new Set();


const sortThumbnails = (manifest) => {
    console.log(manifest);

    const canvases = manifest.items
    const newItems = []
    for (const canvas of canvases) {
        canvas.thumbnail.sort((thumb1,thumb2) => {
            return thumb2.width-thumb1.width
        });

        newItems.push(canvas)
    }
    const newManifest = structuredClone(manifest);

    newManifest.items = newItems;

    writeFileSync('./all-notes/manifest.json',JSON.stringify(newManifest, null, 2));
}

const buildManifest = async () => {

    const items = [], totalNotes = allNotes.length;
    let progress = 0;
    const failed = [];
    for (const note of allNotes) {
        try {
            items.push(await buildCanvas(note));
            progress++;
            console.log(`[${progress}/${totalNotes}] ${note.orig} added to manifest...`)
        }
        catch (e) {
            console.error(e);
            failed.push(note);
        }        
    }

    const manifest = {
        "@context":"http://iiif.io/api/presentation/3/context.json",
        id:`${URL_PREFIX}/${ID}/manifest`,
        type:"Manifest",
        label: {
            "en": ["The Wall: All individual notes"]
        },
        metadata: [
            {
                "label": {"en":["Contributors"]},
                "value": {
                    "en": Array.from(creators)
                }
            },
            {
                "label": {"en":["Assembled by"]},
                "value": {
                    "en": ["Gwen Owen"]
                }
            }
        ],
        items: items
    }

    writeFileSync('./all-notes/manifest.json',JSON.stringify(manifest, null, 2));
    console.log('File saved. Done.')
    console.log('Failed notes:');
    console.log(failed);
    return manifest;
}

const buildCanvas = async (note) => {

    const canvasId = `${URL_PREFIX}/${ID}/manifest.json/${note._id}`

    if (note.creator) {
        note.creator = getUserById(note.creator).name;

        creators.add(note.creator);
    }
    const art = new Art(note);

    const iiifCanvas = await art.toIiifCanvas(canvasId);
    return iiifCanvas
}

const addTargets = async (manifest) => {

    const newManifest = structuredClone(manifest);

    const canvases = manifest.items;
    const newItems = [];
    for (const canvas of canvases) {

        canvas.items[0].items[0].target = canvas.id;
        newItems.push(canvas);
    }

    newManifest.items = newItems;
    writeFileSync('./all-notes/manifest.json',JSON.stringify(newManifest, null, 2));
}

const addLabels = async (manifest) => {

    const newManifest = structuredClone(manifest);

    const canvases = manifest.items;
    const newCanvases = [];
    for (const canvas of canvases) {
        const newMetadata = [];
        for (const metadataEntry of canvas.metadata) {
            if (metadataEntry.label["en"][0] === 'Title') {
                const titleValue = metadataEntry.value["en"][0];
                if (titleValue) canvas.label = metadataEntry.value;
            }
            else {
                newMetadata.push(metadataEntry);
            }
        }
        canvas.metadata = newMetadata;

        newCanvases.push(canvas);
    }

    newManifest.items = newCanvases;
    writeFileSync('./all-notes/manifest.json',JSON.stringify(newManifest, null, 2));
}

addLabels(allNotesManifest);


// const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)]
// const specificNote = getNoteById('64f3db0f831d677c80b1743d')

// const failedIds = ['6760afeb2f92d6dd7e4e7a98','6760afe12f92d6dd7e4e7a96','6760afd72f92d6dd7e4e7a94']

// const supplement = [];

// for (const noteId of failedIds) {

//     const note = getNoteById(noteId)
//     supplement.push(await buildCanvas(note));
// }

// writeFileSync('./all-notes/supplement.json', JSON.stringify(supplement, null, 2))
//await buildManifest();



//addTargets(allNotesManifest);
console.log('Done.')