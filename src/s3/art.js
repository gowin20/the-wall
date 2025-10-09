import { Art } from 'gallery-image';
import '../loadEnvironment.mjs';
import { uploadImage, createFolderIfNotExist } from "./s3.mjs";
import { S3_ADDRESS, S3_ART_PREFIX } from '../loadEnvironment';

export const uploadThumbnailToS3 = async (art, thumbnailSize) => {
    
    let thumbnail;
    if (art.thumbnailExists(thumbnailSize)) {
        const currentThumbnail = art.getThumbnail(thumbnailSize);

        if (currentThumbnail instanceof Buffer) thumbnail = currentThumbnail;      
        else if (typeof currentThumbnail === 'string') {
            
            if (currentThumbnail.includes(S3_ADDRESS)) {
                // file already uploaded
                console.log('Duplicate file upload')
                return currentThumbnail;
            }

            // Load from local file
            else thumbnail = await art.loadThumbnail(thumbnailSize)
        }
        else if (currentThumbnail instanceof URL) {
            // file already uploaded
            return currentThumbnail.href;
        }
    }
    else {
        thumbnail = await art.generateThumbnail(thumbnailSize);
    }
    const path = `${S3_ART_PREFIX}${art.sourceName}/${thumbnailSize}px.jpeg`;

    const thumbnailUrl = await uploadImage(path,thumbnail);
    art.thumbnails[thumbnailSize] = thumbnailUrl;
    return thumbnailUrl;
}

export const uploadOrigToS3 = async (art) => {

    // art.source is a buffer !
    let sourceBuffer;

    if (art.source instanceof Buffer) sourceBuffer = art.source;
    else if (typeof art.source === 'string' && art.source.includes(S3_ADDRESS)) {
        console.log('Duplicate orig image upload.');
        return art.source;
    }
    else if (art.source instanceof URL && art.href.includes(S3_ADDRESS)) {
        console.log('Duplicate orig image upload.');
        return art.source.href;
    }

    sourceBuffer = await art.createSourcePyramid();

    // TODO GET IMAGE DIMENSIONS AND ATTACH TO UPLOAD IMAGE
    const folderPath = `${S3_ART_PREFIX}${art.sourceName}/`;
    await createFolderIfNotExist(folderPath);

    const sourceUrl = await uploadImage(`${folderPath}${art.sourceName}.tiff`, sourceBuffer);
    art.source = sourceUrl;

    return sourceUrl;
}