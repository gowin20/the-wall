import {makeRandomPattern} from "../make-random.mjs";
import { Layout } from "./layout.mjs";
import { insertLayout } from "../../db/crud-layouts.mjs";

class CustomLayout extends Layout {

    async init(noteIds, options, callback) {
        if (!noteIds) throw new Error('A list of note IDs is required to initialize a CustomLayout.');

        this.noteIds = noteIds;

        await this.initializeLayout(options);
        callback.bind(this)();
    }
    async getPattern(options) {
        const ASPECT_RATIO = options.ratio || 9/16;

        const pattern = await makeRandomPattern(this.noteIds, {
            cols:options.numCols,
            rows:options.numRows,
            ratio:ASPECT_RATIO
        })
        return pattern;
    }
    async insert() {
        // TODO
        // insert layout to layouts collection
        // await insertLayout(layoutObj);

        // insert layout image to images collection
        // await this.image.insert();

        // don't do anything else
        console.log('Check me out! we got here CUSTOM :)');
    }
}

const customLayout = (layoutId) => {
    return new CustomLayout(layoutId);
}
export default customLayout;