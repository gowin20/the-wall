import { DZI } from "./dzi.mjs";
import sharp from "sharp";
import stitchedImage from "./stitchedImage.mjs";

class DZIFromStitch extends DZI {
    // input: a StitchedImage
    async init(options,callback) {
        await this.generate(options.saveFiles);
        callback.bind(this)();
    }
    
    async generate(saveFiles) {

        const totalSteps = 2;
        console.log(`[STEP 1/${totalSteps}] Creating stitched image`);

        const stitch = await stitchedImage(this.layout);
        await stitch.generate(saveFiles);
        console.log(`[STEP 1/${totalSteps} DONE] Stitched image created.`);


        console.log(`[STEP 2/${totalSteps}] Generating DZI`);

        const imageBuffer = stitch.getBuffer();
        // Generate dzi directory in temp folder
        const dzi = await sharp(imageBuffer)
        .jpeg()
        .tile({
            size:this.layout.noteImageSize*2
        })
        .toFile(`${this.path}/${this.name}.dz`, (err, info) => {
            console.log(err,info)
        })

        // TODO delete temp files (from DZI)
        
        return dzi;
    }
}

const dziFromStitch = (layout) => {
    return new DZIFromStitch(layout);
}

export default dziFromStitch;