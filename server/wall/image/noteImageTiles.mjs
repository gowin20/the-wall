import fetch from 'node-fetch';
import imageSize from 'image-size';
import fs from 'fs';
import sharp from 'sharp';
import { uploadDziFolder } from "../s3.mjs";
import { insertOrUpdateDzi } from '../../db/crud-dzis.mjs';

const TEMP_NOTE_DIR = './wall/temp/notes';

class NoteImageTiles {
    constructor(note) {

        if (!note.name) throw new Error('Note needs a name to generate tiles.');
        // Properties related to DZI
        this.origUrl = note.orig;
        this.name = note.name;
        this.TileSize = note.TileSize || 450;
        this.xmlns = "http://schemas.microsoft.com/deepzoom/2008";
        this.Format = 'jpeg';
        this.Overlap = 0;

        // Properties related to file storage / upload
        this.s3DirName = note.dirName;
        this.outputFolder = TEMP_NOTE_DIR+this.name;

        if (fs.existsSync(this.outputFolder)) fs.rmSync(this.outputFolder,{recursive:true})
        fs.mkdirSync(this.outputFolder);
    }

    async create() {
        await this.generate();
        await this.uploadToS3();
        this._id = await this.insert();

        return this._id;
    }

    toJson() {
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
    async generate() {
        const origImage = await fetch(this.origUrl);
        const imageBuffer = await origImage.buffer();

        const dimensions = imageSize(imageBuffer);
        this.Height = dimensions.height;
        this.Width = dimensions.width;

        
        
        // Generate dzi directory in temp folder
        const dzi = await sharp(imageBuffer)
        .jpeg()
        .tile({
            size:this.TileSize
        }).toFile(this.outputFolder);
        
        return dzi;
    }
    
    async uploadToS3() {

        const localPath = this.outputFolder+'_files/';
        const S3_FOLDER = this.s3DirName+'tiles/';

        this.Url = await uploadDziFolder(localPath,S3_FOLDER);


        fs.rmSync(this.outputFolder, {
            recursive:true
        }, (err) => {
            console.log(err);
            console.log(`Deleted temp directory ${prefix}`);
        });
    }

    async insert() {
        // Inserts DZI
        this._id = await insertOrUpdateDzi(this.toJson());
        return this._id;
    }
}

const noteImageTiles = (note) => {
    return new NoteImageTiles(note);
}

export default noteImageTiles;