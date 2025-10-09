import customLayout from "../wall/layout/customLayout.js";
import defaultLayout from "../wall/layout/defaultLayout.js";
import userLayout from "../wall/layout/userLayout.js";

import {Layout} from 'gallery-image';


const people = {
    'Armin':'64f3db0f831d677c80b17259',
    'Gwen':'64f3db0f831d677c80b1725f',
    'Oliver':'64f3db0f831d677c80b1726e',
    'Shreya':'64f3db0f831d677c80b1726f',
    'Fionna':'64f3db0f831d677c80b1725e',
    'Margo':'64f3db0f831d677c80b17267',
    'Athya':'64f3db0f831d677c80b1725a',
    'Unknown':'64f3db0f831d677c80b1726c'
}

if (process.argv.length < 3) {
    console.error('Test requires an argument! default or user');
    process.exit(1);
}
if (process.argv.length < 4) {
    console.error('Must provide a layout name / user name');
    process.exit(1);
}


/*

GENERATE DEFAULT LAYOUT
'node generate-cli.js default <LAYOUT NAME>'

Generates a layout containing every note.
*/
if (process.argv[2] === 'default') {

    const thisRatio = process.argv.length == 5 ? (process.argv[4] === 'vertical' ? 9/19.5 : 19.5/9) : 19.5/9;
    // Current default layout is 1430 notes, so either 26 x 55 or 55 x 26.
    // 1015 notes used to take 76 minutes, aka 1.27hrs
    // Now 1430 notes only takes about 5 minutes, including upload to S3/Mongo.
    // SHOULD BE FASTER NOW! - we've cached versions of individual notes at different sizes in S3.
    const defaultOptions = {
        saveFiles:false,
        insert:true,
        name:process.argv[3],
        ratio:thisRatio
    };

    await defaultLayout().init(defaultOptions, ()=>{});
    process.exit(0);
}


/*

GENERATE USER LAYOUT
'node generate-cli.js default <USER'S NAME>'

Generates a layout containing all notes by a user.
*/
if (process.argv[2] === 'user') {

    const userOptions = {
        userId:people[process.argv[3]],
        saveFiles:false,
        insert:true,
        //noteImageSize:16
    }

    await userLayout().init(userOptions,()=>{});
}

/*

GENERATE CUSTOM LAYOUT
'node generate-cli.js default <LAYOUT NAME>`

Generates a layout with custom notes, or random notes if none are provided.
*/
if (process.argv[2] === 'custom') {

    const customOptions = {
        name:process.argv[3],
        randomNotes:true,
        numNotes:20,
        numRows:1,
        numCols:20,
        saveFiles:true,
    }

    // Provide a list of note IDs here to generate using those nows
    await customLayout().init(null, customOptions,()=>{})

    process.exit(0);
}
