import sharp from "sharp";
import { TEMP_DIR } from "../layout/layout.mjs";
import { Image } from "./image.mjs";

class DZI extends Image {
  constructor(options) {
    super();
    this.name = `${options.name}-dzi`;
    this.path = TEMP_DIR + options.name;
  }

  async init(tiff,callback) {
    await this.createDZI(tiff);
    callback.bind(this)();
  }

  async createDZI(tiff) {
    const DZI_IMAGE = tiff;
    // Generate dzi directory in temp folder
    const dzi = await sharp(DZI_IMAGE)
    .jpeg()
    .tile({
        size:576
    })
    .toFile(`${this.path}/${this.name}.dz`, (err, info) => {
        console.log(err,info)
    })
    
    return dzi;
  }

  async toJson(xml) {

  }
}

const dzi = (options) => {
  return new DZI(options);
}

export default dzi;