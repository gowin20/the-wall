import customLayout from "./layout/customLayout.mjs";
import defaultLayout from "./layout/defaultLayout.mjs";
import userLayout from "./layout/userLayout.mjs";

const people = {
    'Armin':'64f3db0f831d677c80b17259',
    'George':'64f3db0f831d677c80b1725f',
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
'node generate-cli.mjs default <LAYOUT NAME>'

Generates a layout containing every note.
*/
if (process.argv[2] === 'default') {

    // 1015 notes takes 76 minutes to run
    // AKA 1.269 hours or 1hr16min

    // SHOULD BE FASTER NOW!
    const defaultOptions = {
        saveFiles:true,
        insert:true,
        setDefault:true,
        name:process.argv[3],
    };

    await defaultLayout().init(defaultOptions, ()=>{});
    process.exit(0);
}


/*

GENERATE USER LAYOUT
'node generate-cli.mjs default <USER'S NAME>'

Generates a layout containing all notes by a user.
*/
if (process.argv[2] === 'user') {

    const userOptions = {
        userId:people[process.argv[3]],
        saveFiles:false,
        insert:true
        //noteImageSize:5
    }

    await userLayout().init(userOptions,()=>{});

    //process.exit(0);
}

/*

GENERATE CUSTOM LAYOUT
'node generate-cli.mjs default <LAYOUT NAME>`

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
    await customLayout().init(null, options,()=>{})

    process.exit(0);
}
