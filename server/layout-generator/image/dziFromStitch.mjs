import { DZI } from "./dzi.mjs";
import sharp from "sharp";
import stitchedImage from "./stitchedImage.mjs";
import { TEMP_DIR } from "../layout/layout.mjs";
import dir from 'node-dir';
import { uploadImage, createFolderIfNotExist } from "../../db/s3.mjs";
import fs from 'fs';

class DZIFromStitch extends DZI {
    // input: a StitchedImage
    async init(options,callback) {
        this.saveFiles = options.saveFiles;
        await this.generate();
        callback.bind(this)();
    }
    
    async generate() {

        this.outputFolder = this.saveFiles ? `${TEMP_DIR}${this.layout.name}/${this.name}` : `${TEMP_DIR}dzi-temp/${this.name}`;

        const totalSteps = 2;
        console.log(`[STEP 1/${totalSteps}] Creating stitched image`);

        const stitch = await stitchedImage(this.layout);
        await stitch.generate(this.saveFiles);
        console.log(`[STEP 1/${totalSteps} DONE] Stitched image created.`);


        console.log(`[STEP 2/${totalSteps}] Generating DZI`);

        const imageBuffer = stitch.getBuffer();
        // Generate dzi directory in temp folder
        const dzi = await sharp(imageBuffer)
        .jpeg()
        .tile({
            size:this.layout.noteImageSize*2
        })
        .toFile(this.outputFolder, (err, info) => {
            console.log(err,info)
        })

        // TODO delete temp files (from DZI)
        
        return dzi;
    }

    async uploadToS3() {
        // Crawl through the output folder and recursively upload all dirs
        await new Promise((resolve) => {
            setTimeout(resolve,5000)
        })

        const prefix = this.outputFolder+'_files';
        const S3_FOLDER = `layouts/${this.name}/`;
        await createFolderIfNotExist(S3_FOLDER);

        dir.files(prefix, async function(err, files) { 
            if (err) throw err;
            for (const file of files) {
                const nameArray = file.split('\\').slice(-2);

                if (nameArray[1] === 'vips-properties.xml') continue;

                const s3FileKey = `${S3_FOLDER}${nameArray[0]}/${nameArray[1]}`;
                console.log(s3FileKey);
                await uploadImage(s3FileKey,fs.createReadStream(file))
            }
        });
        console.log('Successfully uploaded DZI to S3.')

        if (!this.saveFiles) {
            fs.rmdir(prefix, {
                recursive:true
            }, (err) => {
                console.log(`Deleted temp directory ${prefix}`);
            })
        }


    }
}

const dziFromStitch = (layout) => {
    return new DZIFromStitch(layout);
}

export default dziFromStitch;