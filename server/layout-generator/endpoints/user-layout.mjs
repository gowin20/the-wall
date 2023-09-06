import createLayout from "../create-layout.mjs";
import {makeRandomPattern} from "../make-random.mjs";
import {getNotesByUser} from "../../db/get-notes.mjs";
import {getUserByID} from "../../db/get-users.mjs";

const makeUserLayout = async (userID,options) => {

    if (!userID) return console.error('Error: A valid User ID is required to generate a layout');


    const noteIDs = (await getNotesByUser(userID)).map(note => note._id);

    const pattern = await makeRandomPattern(noteIDs, {
        ratio:options.ratio
    })

    const user = await getUserByID(userID);

    console.log('Beginning layout generation...');
    await createLayout(pattern, {
        name:`${user.name}-${noteIDs.length}`,
        saveFiles:options.saveFiles
    })
    return 1
}
export default makeUserLayout;

makeUserLayout('64f3db0f831d677c80b1726e',{
    ratio:16/9,
    saveFiles:true
})

/*

Armin Taheri: 64f3db0f831d677c80b17259
George Owen: 64f3db0f831d677c80b1725f
Oliver Melgrove: 64f3db0f831d677c80b1726e
Shreya Chatterjee: 64f3db0f831d677c80b1726f

*/