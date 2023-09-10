import {makeRandomPattern} from "../make-random.mjs";
import {getNotesByUser} from "../../db/crud-notes.mjs";
import {getUserByID} from "../../db/crud-users.mjs";
import { Layout } from "./layout.mjs";

/*

UserLayout: A layout created by a user.

Usually consists of the user's notes
Associated with the user object

*/

class UserLayout extends Layout {
    async init(options,callback) {

        if (!options.userId) throw new Error('A user ID is required to initialize a UserLayout.');

        this.userId = options.userId;
        const user = await getUserByID(options.userId);

        if (!user) throw new Error('Invalid user ID.');

        this.name = user.name+'-test';

        await this.initializeLayout(options);
        callback.bind(this)();
    }
    async getPattern(options) {
        const noteIDs = (await getNotesByUser(this.userId)).map(note => note._id);

        const ASPECT_RATIO = options.ratio || 9/16

        const pattern = await makeRandomPattern(noteIDs, {
            cols:options.numCols,
            rows:options.numRows,
            ratio:ASPECT_RATIO
        })
        return pattern;
    }
    async insert() {
        // TODO
        // insert layout to layouts collection
        // await this.insertLayoutObject();

        // add layout to associated user
        console.log('Check me out! we got here :)');
        return;
    }
}

const userLayout = (layoutId) => {
    return new UserLayout(layoutId);
}

export default userLayout;