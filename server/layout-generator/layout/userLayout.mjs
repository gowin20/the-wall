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
        const user = await getUserByID(this.userId);

        if (!user) throw new Error('Invalid user ID.');

        this.name = user.name+'-test';
        this.noteIds = (await getNotesByUser(this.userId)).map(note => note._id);

        await this.initializeLayout(options);
        callback.bind(this)();
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