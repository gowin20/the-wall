import fetch from 'node-fetch';
import { getNoteById, addThumbnail, updateNote, insertNewNote } from '../db/crud-notes.mjs';
import sharp from 'sharp';
import { createFolderIfNotExist, uploadImage } from '../s3/s3.mjs';
import noteImageTiles from './noteImageTiles.mjs';

const S3_URL = 'https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/notes\/';
const FOLDER_PREFIX = 'notes/all/';
export const TEMP_NOTE_DIR = './note/temp/';

class Note {
    constructor() {}

    async fromId(id) {
      //if (this._id) throw new Error('Note already initialized, cannot initialize from database.');

      this._id = id;

      const noteObj = await getNoteById(this._id);
      if (!noteObj) throw new Error(`Cannot find note of ID ${this._id} in database`);

      this.setInfo(noteObj);

      return this;
    }

    fromPacket(noteObj) {
      //if (noteObj._id) throw new Error('Cannot provide \'_id\' field when initializing a new note');
      this._id = noteObj._id;
      this.setInfo(noteObj);

      return this;
    }

    setInfo(options) {

      if (options.orig) this.orig = options.orig;
      else throw new Error('No original image provided for Note.');
      this.name = this.orig.substring((S3_URL+'orig/').length,this.orig.length-4);
      this.dirName = FOLDER_PREFIX + this.name +'/';

      if (options.thumbnails) this.thumbnails = options.thumbnails;
      else this.thumbnails = {};

      if (options.tiles) this.tiles = options.tiles;

      if (options.creator) this.creator = options.creator;

      if (options.title) this.title = options.title;
      
      if (options.details) this.details = options.details;
      
      if (options.location) this.location = options.location;
      
      if (options.date) this.date = options.date;

      return;
    }

    toJson() {
      return {
        _id: this._id,
        orig: this.orig,
        thumbnails: this.thumbnails,
        tiles: this.tiles,
        creator: this.creator,
        title: this.title,
        details: this.details,
        location: this.location,
        date: this.date
      }
    }

    thumbnailExists(size) {
      const thumbnailName = `s-${size}px`;
      if (!this.thumbnails[thumbnailName]) return false;
      return true;
    }

    getThumbnail(size) {
      const thumbnailName = `s-${size}px`;
      return this.thumbnails[thumbnailName]
    }

    async createThumbnail(size, update) {

      if (this.thumbnailExists(size)) {
        console.log(`Thumbnail of size ${size} already exists for ${this._id}.`)
        return;
      };

      console.log('Creating thumbnail...')

      const thumbnailName = `s-${size}px`;
      
      // fetch orig
      const origImage = await fetch(this.orig);

      const origBuffer = await origImage.buffer();
      const resizeBuffer = await sharp(origBuffer).resize({width:size}).jpeg().toBuffer();

      //upload to S3
      await createFolderIfNotExist(this.dirName);

      const filePath = this.dirName + thumbnailName + '.jpeg';

      const thumbUrl = await uploadImage(filePath,resizeBuffer);
      console.log(`Uploaded ${thumbUrl} successfully`);

      this.thumbnails[thumbnailName] = thumbUrl;

      if (update) {
        const insertRes = await addThumbnail(this._id,thumbnailName,thumbUrl);
        console.log(`Updated DB of ${this._id}`);
      }
      return;
    }

    async insert() {

        // Insert if note ID does not exist
        // Update if note ID does exist

        if (this._id) {
          await updateNote(this.toJson());
        }
        else {
          this._id = await insertNewNote(this.toJson());
        }

        return this._id;
    }

    // builds tiles for zooming in within the note
    async buildTiles() {

      // If tiles already exist, return
      if (this.tiles) {
        console.log('Note tiles already built for '+this._id);
        return this.tiles;
      }
      this.tiles = await noteImageTiles(this).create();
      return this.tiles;
    }

    async setImage(tile,url) {

    }

    // If 'orig' property is a LOCAL path, upload to S3 and override the result
    async uploadOrigToS3() {
      const S3_URL_REGEX = new RegExp(S3_URL);
      if (S3_URL_REGEX.test(this.orig)) {
        console.log('Orig note already added to S3...');
      }
      else {
        throw new Error('Local file upload still needs to be implemented. (TODO)')
      }
      return this.orig;
    }

    // Initialization function that fully adds a note to our system
    async create() {
      if (!this.orig) throw new Error('An image is required to create a note.');

      console.log('CREATING NOTE '+this.name);
      await this.uploadOrigToS3();
      await this.createThumbnail(288,false); // Default thumbnail size
      await this.buildTiles();
      await this.insert();

      return this._id;
    }
}

const note = () => {
  return new Note();
}

export default note;