import customLayout from "../wall/layout/customLayout.js";
import defaultLayout from "../wall/layout/defaultLayout.js";
import userLayout from "../wall/layout/userLayout.js";
import { getAllLayouts } from "../db/crud-layouts.js";
import { getAllDzis } from "../db/crud-dzis.js";
import { getAllNotes } from "../db/crud-notes.js";
import { getAllUsers } from "../db/crud-users.js";
import * as fs from 'fs'
const getLayout = (layout) => {
    const layoutStructure = {
        _id:layout._id,
        name: layout.name,
        noteImageSize:layout.noteImageSize,
        numRows:layout.numRows,
        numCols:layout.numCols,
        array: layout.array,
        image: layout.image
    }
}

const LAYOUT_DIR = `./wall/temp/export`
if (!fs.existsSync(LAYOUT_DIR)) {
    fs.mkdirSync(LAYOUT_DIR);
    console.log(`Created output directory ${LAYOUT_DIR}`);
}


const allLayouts = await getAllLayouts();
fs.writeFileSync(`${LAYOUT_DIR}/all-layouts.json`, JSON.stringify(allLayouts));

const allNotes = await getAllNotes();
fs.writeFileSync(`${LAYOUT_DIR}/all-notes.json`, JSON.stringify(allNotes));

const allDzis = await getAllDzis();
fs.writeFileSync(`${LAYOUT_DIR}/all-dzis.json`, JSON.stringify(allDzis));

const allUsers = await getAllUsers({});
fs.writeFileSync(`${LAYOUT_DIR}/all-users.json`, JSON.stringify(allUsers));