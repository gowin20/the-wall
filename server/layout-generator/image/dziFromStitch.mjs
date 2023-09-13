import { DZI } from "./dzi.mjs";
import sharp from "sharp";
import stitchedImage from "./stitchedImage.mjs";
import { TEMP_DIR } from "../layout/layout.mjs";
import dir from 'node-dir';
import { uploadImage, createFolderIfNotExist } from "../../db/s3.mjs";
import fs from 'fs';
import util from 'util';

class DZIFromStitch extends DZI {
    // input: a StitchedImage
    async init(options,callback) {

        this.setInfo();

        this.saveFiles = options.saveFiles;

        if (options.saveFiles) {
            this.outputFolder = `${TEMP_DIR}${this.layout.name}/${this.name}`
        }
        else {
            this.tempFolder = `${TEMP_DIR}dzi-temp/`;
            
            if (fs.existsSync(this.tempFolder)) fs.rmSync(this.tempFolder,{recursive:true})
            fs.mkdirSync(this.tempFolder);
            this.outputFolder = this.tempFolder+this.name;
        }

        await this.generate();
        callback.bind(this)();
    }
    
    async generate() {

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
            size:this.TileSize
        }).toFile(this.outputFolder, (err, info) => {
            //console.log(err,info)
        })

        // TODO delete temp files (from DZI)
        
        return dzi;
    }

    async uploadToS3() {
        console.log('[START] Beginning DZI upload to S3...')

        // This is currently  needed in order for sharp.toFile to finish resolving. TODO implement "util.promisify" around sharp.toFile and remove this 5-second delay.
        await new Promise((resolve) => {
            setTimeout(resolve,5000)
        })

        const prefix = this.outputFolder+'_files';
        const S3_FOLDER = `layouts/${this.name}/`;
        await createFolderIfNotExist(S3_FOLDER);

        const readFiles = util.promisify(dir.files);
        const files = await readFiles(prefix);
        const total_files = files.length;
        let count=0;
        for (const file of files) {
            const nameArray = file.split('\\').slice(-2);

            if (nameArray[1] === 'vips-properties.xml') continue;

            const s3FileKey = `${S3_FOLDER}${nameArray[0]}/${nameArray[1]}`;
            await uploadImage(s3FileKey,fs.createReadStream(file))

            count += 1;
            console.log(`[${count}/${total_files}] Uploaded ${s3FileKey}...`);
        }
        console.log('[DONE] Successfully uploaded DZI to S3.')

        if (!this.saveFiles) {
            fs.rmSync(this.tempFolder, {
                recursive:true
            }, (err) => {
                console.log(err);
                console.log(`Deleted temp directory ${prefix}`);
            })
        }

        this.Url = process.env.S3_PREFIX + S3_FOLDER;
        return this.Url;
    }
}

const dziFromStitch = (layout) => {
    return new DZIFromStitch(layout);
}

export default dziFromStitch;