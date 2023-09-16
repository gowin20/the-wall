import { getAllNotes } from "../crud-notes.mjs";
import { getAllUsers } from "../crud-users.mjs";
import note from "../../note/note.mjs";
import defaultLayout from "../../layout-generator/layout/defaultLayout.mjs";
import userLayout from "../../layout-generator/layout/userLayout.mjs";

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

const makeUserLayouts = async () => {
    const allUsers = await getAllUsers();

    for (dbUser of allUsers) {
        const userLayoutOptions = {
            saveFiles:false,
            insert:true,
            userId:dbUser._id
        }
        await userLayout().init(userLayoutOptions,()=>{
            console.log(`Created user layout for ${dbUser.name} (${dbUser._id}).`);
        });
    }
}


const totalSteps = 3;

console.log(`[1/${totalSteps}] Validating all notes...`);
await validateNotes();
console.log(`[1/${totalSteps} DONE] Notes initialized successfully.`);
console.log(`[2/${totalSteps}] Creating new default layout...`);
await makeDefaultLayout();
console.log(`[3/${totalSteps}] Creating all user layouts...`);
await makeUserLayouts();
console.log(`[3/${totalSteps} DONE] All user layouts created.`);