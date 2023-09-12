
export class LayoutImage {
    constructor(layout) {
        if (!layout) throw new Error('Layout images must be created based on a layout.');

        this.layout = layout;
        this.thumbnailName = `s-${this.layout.noteImageSize}px`;
    }

    async encrypt() {
        // TODO
    }

    async init() {
        throw new Error('Method \'init()\' must be implemented.');
    }

    async uploadToS3() {
        throw new Error('Method \'toS3\' must be implemented.');
    }

    async insert() {
        throw new Error('Method \'insert()\' must be implemented.');
    }
}