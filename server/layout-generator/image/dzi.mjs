import sharp from "sharp";
import { TEMP_DIR } from "../layout/layout.mjs";
import { LayoutImage } from "./layoutImage.mjs";

export class DZI extends LayoutImage {
  constructor(layout) {
    super(layout);
    this.name = `${layout.name}-dzi`;
    this.path = TEMP_DIR + this.layout.name;
  }

  async init(options,callback) {
    await this.generate(options.saveFiles);
    callback.bind(this)();
  }

  async generate(saveFiles) {   
    throw new Error('Method generate of DZI does not currently work, use class DZIFromStitch instead.');

    // TODO create a DZI from a 2D pattern of notes :)
  }

  async toJson(xml) {
    // TODO implement this to create a DB object
  }

  async insert() {
    const infoObject = await this.toJson();
  }

  async uploadToS3() {
    // TODO recursively crawl through temp directory and upload all images 
  }
}

const dzi = (layout) => {
  return new DZI(layout);
}

export default dzi;