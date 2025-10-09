import { Layout, Art } from "gallery-image";
import { addThumbnail, getAllNotes, getNoteById } from '../db/crud-notes.js';
import { insertLayout } from "../db/crud-layouts.js";
import { uploadOrigToS3, uploadThumbnailToS3 } from "../../s3/art.js";


const DPI_300_SIZE = 900;

const makeThumbnail = async (objectId, thumbnailSize) => {
    if (!thumbnailSize) throw new Error('Thumbnail size is required.');
    
    const note = await getNoteById(objectId);
    const art = new Art(note);
    const thumbnailUrl = await uploadThumbnailToS3(art, thumbnailSize);
    await addThumbnail(art._id, thumbnailSize, thumbnailUrl);

    console.log('Uploaded.');
    console.log(art);
    return;
}

await makeThumbnail('64f3db0f831d677c80b17529',900)


const makeAllThumbnails = async (thumbnailSize) => {
    if (!thumbnailSize) throw new Error('Thumbnail size is required.');
    
    const allNotes = await getAllNotes();

    for (const note of allNotes) {
        try {
            const art = new Art(note);
            const thumbnailUrl = await uploadThumbnailToS3(art, thumbnailSize);
            await addThumbnail(art._id, thumbnailSize, thumbnailUrl);
        }
        catch (e) {
            console.log(e);
            console.log('Problematic note:');
            console.log(note)
        }
    }
    
    console.log('Upload complete.')
}

const toDbJson = (art) => {
    return {
        _id: art._id,
        source: art.source,
        thumbnails: art.thumbnails,
        metadata: art.metadata
    }
}

const toOldDbJson = (art) => {
    return {
        _id: art._id,
        orig: art.source,
        thumbnails: art.thumbnails,
        creator: art.metadata.creator,
        title: art.metadata.title,
        details: art.metadata.details,
        date: art.metadata.date,
        location: art.metadata.location
    }
}
