
// S3 CONNECT
export const S3_ADDRESS = 'https:\/\/the-wall-source.s3.us-west-1.amazonaws.com\/';
export const S3_ART_ORIG = `notes\/orig\/`;
export const S3_ART_IMAGES = `notes\/all\/`;
export const S3_LAYOUT_IMAGES = `layouts\/`;

// legacy function that gets the actual directory name based on Art ID. Originally based on "orig"
export const getS3ArtDirName = async (art: Art) => {
    if (!art._id || !art.orig) throw new Error('this method gets directory based on original image URL');

    const orig = art.orig as string;
    // Isolate file name without PNG
    const fileName = orig.substring((S3_ADDRESS+'orig/').length, orig.length-4);

    const dirName = `${S3_ART_IMAGES}${fileName}/`;
    return dirName;
}

export const uploadArtToS3 = async (art: Art) => {

    const dirName = getS3ArtDirName(art);

    // Upload original image
    if (art.orig instanceof Buffer) {

    }

    Object.keys(art.thumbnails).forEach(thumbnail => {
        // Upload thumbnails
        if (art.thumbnails[thumbnail] instanceof Buffer) {
            const url = await uploadImageBlob()
        }
    });

    // Upload image tiles
    if (art.image) {

    }

    const thumbnailUrl = await uploadArtThumbnail(this,`${thisThumbnail}.jpeg`);
    const result = await insertThumbnail(this._id, thumbnailName, )
}

export const insertArtToMongo = async (art: Art) => {

    // Validate all images are S3 URLs
    if (typeof art.orig !== 'string') throw new Error('Must upload to S3 first.');
}


// For image blobs e.g. PNG, JPEG, TIFF
export const uploadImageBlob = async (key: string, blob: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: blob,
    Tagging: "public=yes"
  });
  const result = await client.send(command);

  if (result.$metadata.httpStatusCode !== 200) throw new Error(`Error uploading note: ${result}`);

  // return a formatted URL pointing to image;
  return S3_ADDRESS+key;
};

// For image folders e.g. DZI, IIIF, etc
export const uploadImageFolder = async (path: string, localPath: string) => {

}