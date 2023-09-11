import customLayout from "./layout/customLayout.mjs";
import defaultLayout from "./layout/defaultLayout.mjs";
import userLayout from "./layout/userLayout.mjs";
import { getRandomNotes } from "../db/crud-notes.mjs";

const makeUserLayout = async (options) => {
    const layout = userLayout();
    await layout.init(options,()=>{
        console.log('Callback!');
    })
}

const makeDefaultLayout = async (options) => {
    await defaultLayout().init(options, ()=> {
        console.log('YEAH WOOHOO!');
    })
}

const makeCustomLayout = async (noteIds,options) => {
    await customLayout().init(noteIds,options,()=>{
        console.log('Custom callback function.');
    })
}

if (process.argv.length < 3) {
    console.error('Test requires an argument! default or user');
    process.exit(1);
}

if (process.argv[2] === 'default') {

    // 1015 notes takes 76 minutes to run
    // AKA 1.269 hours or 1hr16min
    await makeDefaultLayout({
        saveFiles:true,
        name:'stitched-1015-3',
        generate:true
    });
    process.exit(0);
}

if (process.argv[2] === 'user') {

    if (process.argv.length <= 3) {
        console.error('Must provide a user first name');
        process.exit(1);
    }

    const people = {
        'Armin':'64f3db0f831d677c80b17259',
        'George':'64f3db0f831d677c80b1725f',
        'Oliver':'64f3db0f831d677c80b1726e',
        'Shreya':'64f3db0f831d677c80b1726f',
        'Mia':''
    }

    const ID = people[process.argv[3]]
    await makeUserLayout({
        userId:ID,
        saveFiles:true,
        generate:true
    })

    process.exit(0);
}

if (process.argv[2] === 'custom') {

    const NUM_NOTES = 20

    const layoutNoteIDs = (await getRandomNotes(NUM_NOTES)).map(note => note._id);

    await makeCustomLayout(layoutNoteIDs,{
        name:'custom-2x10',
        numRows:2,
        numCols:10,
        saveFiles:true,
        generate:true
    });

    process.exit(0);
}
