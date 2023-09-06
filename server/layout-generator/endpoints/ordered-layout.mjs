import createLayout from "../create-layout.mjs";

const makeOrderedLayout = async (pattern,options) => {

    if (!pattern) {
        console.error('Error: A pattern is required to generate an ordered layout.');
    }

    // 3. call createLayout with pattern
    console.log('Beginning layout generation...')
    await createLayout(pattern, {
        name:options.name,
        saveFiles:options.saveFiles,
        fromDisk:options.fromDisk
    });
    return 1
}
export default makeOrderedLayout;