import sharp from "sharp";
import { TEMP_DIR } from "../layout/layout.mjs";

const createDZI = async (tiff,options) => {
  const LAYOUT_DIR = TEMP_DIR + options.name;
  const DZI_IMAGE = tiff || `${LAYOUT_DIR}/${options.name}-stitched.tiff`
  // Generate dzi directory in temp folder
  const dzi = await sharp(DZI_IMAGE)
  .jpeg()
  .tile({
      size:576
  })
  .toFile(`${LAYOUT_DIR}/${options.name}-dzi.dz`, (err, info) => {
      console.log(err,info)
  })

  return dzi;
}

export default createDZI;