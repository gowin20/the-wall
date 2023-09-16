/* 
Abstract class representing a layout image

Supports the following formats:
* Stitched image - a single output file representing the entire layout. Use class `StitchedImage`.
* DZI - an image pyramid representing the layout as many files. Use class `DZI`.
* DZI from stitch - a DZI image generated from a static file, rather than dynamically. Use class `DZIFromStitch`.

*/
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