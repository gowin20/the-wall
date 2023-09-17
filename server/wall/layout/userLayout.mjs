import {getNotesByUser} from "../../db/crud-notes.mjs";
import {getUserByID, updateUserLayout} from "../../db/crud-users.mjs";
import { Layout } from "./layout.mjs";
import { getLayoutIdByName, insertLayout } from "../../db/crud-layouts.mjs";

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

        this.name = user.name.replace(' ', '-')+'--test';
        this.noteIds = (await getNotesByUser(this.userId)).map(note => note._id);

        await this.initializeLayout(options);
        callback.bind(this)();
    }
    async insert() {
        // TODO
        // insert layout to layouts collection
        // await this.insertLayoutObject();
        console.log('[DB] Inserting layout...')
        this._id = await insertLayout(this.toJson())

        if (!this._id) this._id = await getLayoutIdByName(this.name);
        console.log(`[DB DONE] Successfully inserted new layout at ${this._id}.`);
        // add layout to associated user
        await updateUserLayout(this.userId,this._id);
        //await insertLayout()
        return this._id;
    }
}

const userLayout = (layoutId) => {
    return new UserLayout(layoutId);
}

export default userLayout;