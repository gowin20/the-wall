import { Layout } from "./layout.mjs";
import { insertLayout } from "../../db/crud-layouts.mjs";
import { getRandomNotes } from "../../db/crud-notes.mjs";

class CustomLayout extends Layout {

    async init(noteIds, options, callback) {
        if (!noteIds && !options.randomNotes) throw new Error('A list of note IDs is required to initialize a CustomLayout.');

        if (noteIds && options.randomNotes) throw new Error('Cannot set \'randomNotes\' flag when providing a list of note IDs.')

        if (options.randomNotes) {

            if (!options.numNotes) throw new Error('Must provide a number of notes when using \'randomNotes\'.');

            this.noteIds = (await getRandomNotes(options.numNotes)).map(note => note._id);
        }
        else {
            this.noteIds = noteIds;
        }

        await this.initializeLayout(options);

        callback.bind(this)();
    }

    async insert() {
        throw new Error('DB does not support custom layouts.')
        // TODO
        // insert layout to layouts collection
        // await insertLayout(layoutObj);

        // insert layout image to images collection
        // await this.image.insert();

        // don't do anything else
    }
}

const customLayout = (layoutId) => {
    return new CustomLayout(layoutId);
}
export default customLayout;