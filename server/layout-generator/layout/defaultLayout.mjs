import { makeRandomPattern } from "../make-random.mjs";
import { Layout } from "./layout.mjs";
import { getAllNotes } from "../../db/crud-notes.mjs";
import { insertLayout } from "../../db/crud-layouts.mjs";


class DefaultLayout extends Layout {
    async init(options) {
        if (options.setDefault) this.default = true;

        await this.initializeLayout(options);
        callback.bind(this)();
    }
    async getPattern(options) {
        const allNoteIds = (await getAllNotes()).map(note=>note._id);

        const ASPECT_RATIO = options.ratio || 320/146

        // 1920/878: size when full screen in firefox on standard resolution monitor

        const pattern = await makeRandomPattern(allNoteIds,{
            ratio:ASPECT_RATIO
        });
        return pattern;
    }
    async insert() {

        const layoutObj = this.toDbObj();

        layoutObj.default = this.setDefault;

        //TODO remove previous default layout
        //await insertLayout(layoutObj);

        console.log('Check me out! we got here DEFAULT EDITION!! :)');
    }
}

const defaultLayout = (layoutId) => {
    return new DefaultLayout(layoutId);
}

export default defaultLayout;