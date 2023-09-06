import createLayout from "../create-layout.mjs";
import {makeRandomPattern, getRandomNotes} from "../make-random.mjs";

const makeCustomLayout = async (notes,options) => {

    if (!notes) {
        console.error('Error: A list of NoteObjectIDs is required to generate a custom layout.');
    }

    const pattern = await makeRandomPattern(notes, {
        ratio: options.ratio
    });

    // 3. call createLayout with pattern
    console.log('Beginning layout generation...')
    createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
}

const layoutNotes = await getRandomNotes(10);

makeCustomLayout(layoutNotes,{
    name:'custom-2x10',
    ratio:2/10,
    saveFiles:true,
});