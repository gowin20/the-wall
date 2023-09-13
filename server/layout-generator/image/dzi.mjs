import sharp from "sharp";
import { LayoutImage } from "./layoutImage.mjs";
import { insertDzi } from "../../db/crud-dzis.mjs";

export class DZI extends LayoutImage {
  constructor(layout) {
    super(layout);
    this.name = `${layout.name}-dzi`;

    if (this.layout.image) {
      // DZI already exists in DB
      this.fromDb();
    }
  }
  fromDb() {

  }

  async init(options,callback) {
    this.setInfo();
    await this.generate(options.saveFiles);
    callback.bind(this)();
  }

  setInfo() {
    this.xmlns = "http://schemas.microsoft.com/deepzoom/2008";
    this.Format = 'jpeg';
    this.Overlap = 0;
    this.TileSize = this.layout.noteImageSize*2;
    this.Height = this.layout.numRows * this.layout.noteImageSize;
    this.Width = this.layout.numCols * this.layout.noteImageSize; 
  }

  async generate(saveFiles) {   
    throw new Error('Method generate of DZI does not currently work, use class DZIFromStitch instead.');

    // TODO create a DZI from a 2D pattern of notes :)
  }

  async toJson() {
    // TODO implement this to create a DB object
    return {
      _id:this._id,
      name:this.name,
      Image: {
        Url: this.Url,
        xmlns: this.xmlns,
        Format: this.Format,
        Overlap: this.Overlap,
        TileSize: this.TileSize,
        Size: {
          Height:this.Height,
          Width:this.Width
        }
      }
    }
  }

  async insert() {

    console.log('[Mongo] Inserting DZI...');
    const dziObj = await this.toJson();

    this._id = insertDzi(dziObj);

    console.log(`[Mongo] Successfully inserted new DZI at ${this._id}`);

    return this._id;
  }

  async uploadToS3() {
    // This method will simply upload a list of buffers from memory. See 'dziFromStitch' for a program that crawls a directory
  }
}

const dzi = (layout) => {
  return new DZI(layout);
}

export default dzi;