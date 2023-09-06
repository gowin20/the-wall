import createLayout from "../create-layout.mjs";
import {makeRandomPattern} from "../make-random.mjs";
import { getRandomNotes } from "../../db/get-notes.mjs";

const makeCustomLayout = async (notes,options) => {

    if (!notes) {
        console.error('Error: A list of NoteObjectIDs is required to generate a custom layout.');
    }

    const pattern = await makeRandomPattern(notes, {
        ratio: options.ratio,
        rows:options.rows,
        cols:options.cols
    });

    // 3. call createLayout with pattern
    console.log('Beginning layout generation...')
    await createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
    return 1
}
export default makeCustomLayout;


const layoutNoteIDs = (await getRandomNotes(20)).map(note => note._id);

makeCustomLayout(layoutNoteIDs,{
    name:'custom-2x10',
    rows:2,
    cols:10,
    saveFiles:true,
});