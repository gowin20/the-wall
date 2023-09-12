import { DZI } from "./dzi.mjs";

class DZIFromBuffer extends DZI {

    async generate(buffer, saveFiles) {
        
        const imageBuffer = stitch.getBuffer();
        // Generate dzi directory in temp folder
        const dzi = await sharp(buffer)
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

const dziFromBuffer = (layout) => {
    return new DZIFromBuffer(layout);
}