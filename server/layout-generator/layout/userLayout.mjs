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
        console.log(options);
        if (!options.username) return console.error('Error: A valid User ID is required to generate a layout');

        this.username = options.username;
        this.name = options.username+'-test';

        const result = await this.initializeLayout(options);
        callback.bind(this)();
    }
    async getPattern(options) {
        const noteIDs = (await getNotesByUser(this.username)).map(note => note._id);

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