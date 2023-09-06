import createLayout from "../create-layout.mjs";
import { makeRandomPattern } from "../make-random.mjs";

const makeDefaultLayout = async (options) => {

    const pattern = await makeRandomPattern(null,{
        ratio:320/111
    });
    
    console.log('Beginning layout generation...')
    await createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
    return 1;
}
export default makeDefaultLayout;

makeDefaultLayout({
    saveFiles:true,
    name:'stitched-1015-2'
});