import createLayout from "../create-layout.mjs";
import {makeRandomPattern, getRandomNoteIDs} from "../make-random.mjs";

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
    createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
}

const layoutNotes = await getRandomNoteIDs(20);

makeCustomLayout(layoutNotes,{
    name:'custom-2x10',
    rows:2,
    cols:10,
    saveFiles:true,
});