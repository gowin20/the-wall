import fetch from 'node-fetch';
import { getNoteById, addThumbnail } from '../db/crud-notes.mjs';
import { ObjectId } from 'mongodb';
import sharp from 'sharp';
import { createFolderIfNotExist, uploadImage } from '../db/s3.mjs';

const S3_URL = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/';
const FOLDER_PREFIX = 'notes/all/';

class Note {
    constructor() {}

    async fromId(id) {
      //if (this._id) throw new Error('Note already initialized, cannot initialize from database.');

      this._id = id;

      const result = await getNoteById(this._id);
      if (!result) throw new Error(`Cannot find note of ID ${this._id} in database`);

      this.setInfo(result);
    }

    async fromFile() {
      if (this._id) throw new Error('Note already initialized, cannot initialize from file.');

      this._id = new ObjectId();
    }

    setInfo(options) {

      if (options.orig) this.orig = options.orig;
      else throw new Error('No original image provided for Note.');

      this.dirName = this.orig.substring((S3_URL+'orig/').length,this.orig.length-4)+'/';

      if (options.thumbnails) this.thumbnails = options.thumbnails;
      else this.thumbnails = {};

      if (options.creator) this.creator = options.creator;

      if (options.title) this.title = options.title;
      
      if (options.details) this.details = options.details;
      
      if (options.location) this.location = options.location;
      
      if (options.date) this.date = options.date;

      return;
    }

    thumbnailExists(size) {

      if (!this.thumbnails[size]) return false;
      return true;
    }

    async createThumbnail(thumbnailName,size) {

      if (this.thumbnails[thumbnailName]) throw new Error(`Thumbnail of size ${size} already exists.`)

      console.log('Creating thumbnail...')
//      throw new Error('NEED TO CREATE THUMBNAIL')
      
      // fetch orig
      const origImage = await fetch(this.orig);

      const origBuffer = await origImage.buffer();
      const resizeBuffer = await sharp(origBuffer).resize({width:size}).jpeg().toBuffer();

      //upload to S3
      const folderPath = FOLDER_PREFIX + this.dirName;
      const folderResult = await createFolderIfNotExist(folderPath);
      console.log(`Created new folder: ${folderPath}`);
      const filePath = folderPath + thumbnailName + '.jpeg';

      console.log(filePath);
      const thumbUrl = await uploadImage(filePath,resizeBuffer);
      console.log(`Uploaded ${thumbUrl} successfully`);
      const insertRes = await addThumbnail(this._id,thumbnailName,thumbUrl);
      console.log(`Updated DB of ${this._id}`);
      return;
    }

    async insert() {

        // Insert if note ID does not exist
        // Update if note ID does exist
    }
    // builds tiles for zooming in within the note
    async buildTiles() {
        this.tiles = {

        }
    }

    async setImage(tile,url) {

    }

    async uploadImage() {


    }
}

const note = (id) => {
  return new Note(id);
}

export default note;

export const uploadNote = async (path,options) => {
    // TODO
  }
  
  export const uploadNotesBulk = async (path,options) => {
    // TODO
  }
  
  export const deleteNote = async (path,options) => {
    // TODO
  }