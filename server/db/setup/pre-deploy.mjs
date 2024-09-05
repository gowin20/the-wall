import { getAllNotes } from "../crud-notes.mjs";
import { getAllUsers, getUserByUsername } from "../crud-users.mjs";
import note from "../../wall/note.mjs";
import defaultLayout from "../../wall/layout/defaultLayout.mjs";
import userLayout from "../../wall/layout/userLayout.mjs";

const validateNotes = async () => {
    const notes = await getAllNotes();

    for (const dbNote of notes) {
    
        const noteObj = await note().fromId(dbNote._id);
        await noteObj.create();
    }
}

const makeDefaultLayout = async () => {
    const currentTime = new Date(Date.now()).toISOString().replace(/\..+/,'');

    const defaultOptions = {
        saveFiles:true,
        insert:true,
        setDefault:true,
        name:`default-${currentTime}`,
    };
    
    await defaultLayout().init(defaultOptions, ()=>{
        console.log(`[2/${totalSteps} DONE] Default layout created successfully.`);
    });
}

const makeUserLayouts = async (whichUsers) => {
    const users = []
    if (whichUsers == 'creators') {
        
        users.push(await getUserByUsername('gowin'));
        users.push(await getUserByUsername('armin'));
        users.push(await getUserByUsername('melgrove'));
        users.push(await getUserByUsername('myim'));
    }
    else if (whichUsers == 'all') users.push(...(await getAllUsers()));

    for (const user of users) {
        console.log(`Creating layout for ${user.username} (${user._id})...`)
        const userLayoutOptions = {
            saveFiles:false,
            insert:true,
            userId:user._id
        }
        await userLayout().init(userLayoutOptions,()=>{
            console.log(`Layout for ${user.username} (${user._id}) created.`);
        });
    }
    return;
}


const totalSteps = 3;

//console.log(`[1/${totalSteps}] Validating all notes...`);
//await validateNotes();
//console.log(`[1/${totalSteps} DONE] Notes initialized successfully.`);
//console.log(`[2/${totalSteps}] Creating new default layout...`);
//await makeDefaultLayout();
console.log(`[3/${totalSteps}] Creating all user layouts...`);
await makeUserLayouts('creators');
console.log(`[3/${totalSteps} DONE] All user layouts created.`);