import { DZI } from "./dzi.mjs";
import sharp from "sharp";
import stitchedImage from "./stitchedImage.mjs";
import { TEMP_LAYOUT_DIR } from "../layout/layout.mjs";
import dir from 'node-dir';
import { uploadImage, createFolderIfNotExist, uploadDziFolder } from "../s3.mjs";
import fs from 'fs';
import util from 'util';

class DZIFromStitch extends DZI {
    // input: a StitchedImage
    async init(options,callback) {

        this.setInfo();

        this.saveFiles = options.saveFiles;

        if (options.saveFiles) {
            this.outputFolder = `${TEMP_LAYOUT_DIR}${this.layout.name}/${this.name}`
        }
        else {
            this.tempFolder = `${TEMP_LAYOUT_DIR}dzi-temp/`;
            
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
        }).toFile(this.outputFolder);
        
        return dzi;
    }

    async uploadToS3() {
        console.log('[START] Beginning DZI upload to S3...')

        const localPath = this.outputFolder+'_files';
        const S3_FOLDER = `layouts/${this.name}/`;

        this.Url = await uploadDziFolder(localPath,S3_FOLDER);

        // remove local files
        if (!this.saveFiles) {
            fs.rmSync(this.tempFolder, {
                recursive:true
            }, (err) => {
                console.log(err);
                console.log(`Deleted temp directory ${prefix}`);
            })
        }

        //this.Url = process.env.S3_PREFIX + S3_FOLDER;
        return this.Url;
    }
}

const dziFromStitch = (layout) => {
    return new DZIFromStitch(layout);
}

export default dziFromStitch;