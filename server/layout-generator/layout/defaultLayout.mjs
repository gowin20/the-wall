import { Layout } from "./layout.mjs";
import { getAllNotes } from "../../db/crud-notes.mjs";
import { insertLayout } from "../../db/crud-layouts.mjs";


class DefaultLayout extends Layout {
    async init(options) {
        if (options.setDefault) this.default = true;

        this.noteIds = (await getAllNotes()).map(note=>note._id);
        this.ratio = options.ratio || 320/146;

        await this.initializeLayout(options);
        callback.bind(this)();
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