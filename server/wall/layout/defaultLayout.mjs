import { Layout } from "./layout.mjs";
import { getAllNotes } from "../../db/crud-notes.mjs";
import { insertLayout } from "../../db/crud-layouts.mjs";


class DefaultLayout extends Layout {
    async init(options,callback) {
        if (options.setDefault) this.default = true;

        this.noteIds = (await getAllNotes()).map(note=>note._id);
        this.ratio = options.ratio || 19.5/9;

        await this.initializeLayout(options);
        callback.bind(this)();
    }

    async insert() {

        const defaultLayout = this.toJson();
        if (this.default) {
            // TODO remove previous default layout
            console.log('Setting this layout as default...')
            await removeDefaultLayout();
            defaultLayout.default = true;
        }

        this._id = await insertLayout(defaultLayout);
        return this._id;
    }
}

const defaultLayout = (layoutId) => {
    return new DefaultLayout(layoutId);
}

export default defaultLayout;