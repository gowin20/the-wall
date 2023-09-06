import createLayout from "../create-layout.mjs";
import { makeRandomPattern } from "../make-random.mjs";

const makeDefaultLayout = async (options) => {

    let pattern;
    if (!options.fromDisk) pattern = await makeRandomPattern(null,{
        ratio:320/111
    });
    else {console.log('using existing pattern.')}
    // 3. call createLayout with pattern
    console.log('Beginning layout generation...')
    createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
}

makeDefaultLayout({
    saveFiles:true,
    name:'stitched-1015-2'
});