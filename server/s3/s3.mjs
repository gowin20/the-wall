import {
    S3Client,
    // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
    ListObjectsV2Command,
    PutObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand
  } from "@aws-sdk/client-s3";
import fs from 'fs';
import dir from 'node-dir';
import util from 'util';

const client = new S3Client({
  region:'us-west-1'
});

const BUCKET = 'the-wall-source';
const S3_ADDRESS = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';

export const listFolder = async (folder) => {

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: folder,
    // The default and maximum number of keys returned is 1000.
  });

  try {
    let isTruncated = true;
    let noteList = {notes:[]};

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);

      const contentList = (Contents.map((c)=>c.Key));
      noteList.notes.push.apply(noteList.notes,contentList);

      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }

    return noteList.notes;
  } catch (err) {
    console.error(err);
  }
};

// Key: folder/in/bucket/


/*

Folder manupulation

*/

async function createFolder(Key) {
  const command = new PutObjectCommand({
    Bucket: BUCKET, 
    Key: Key
  });
  const res = await client.send(command);
  console.log(`Created new S3 folder: ${Key}`);
  return res;
}

async function existsFolder(Key) {
  const command = new HeadObjectCommand({
    Bucket:BUCKET, 
    Key:Key });

  try {
    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    } else {
      throw error;
    }
  }
}

export async function createFolderIfNotExist(Key) {
  if (!(await existsFolder(Key))) {
    return await createFolder(Key);
  }
}

export async function deleteFolder(Key) {
  const command = new DeleteObjectCommand({ 
    Bucket:BUCKET, 
    Key:Key 
  });
  return await client.send(command);
}

/*

Image upload / delete

*/

export async function uploadImage(key,data) {

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: data,
    Tagging: "public=yes"
  });
  const result = await client.send(command);

  if (result.$metadata.httpStatusCode !== 200) throw new Error(`Error uploading note: ${result}`);

  // return a formatted URL pointing to image;
  return S3_ADDRESS+key;
}

export async function deleteItem(Key) {
  const command = new DeleteObjectCommand({ 
    Bucket:BUCKET, 
    Key:Key 
  });
  return await client.send(command);
}

// used for DZIs
export async function emptyDirectory(dir) {
  // Prevent disaster from occurring
  if (Key === 'notes/' || Key === 'layouts/') {
    throw new Error('Cannot delete contents of root directories');
  }

  const listedObjects = await s3.listObjectsV2({
    Bucket: BUCKET,
    Prefix: dir
  }).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
      Bucket: BUCKET,
      Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

export const uploadDziFolder = async (localPath,s3Path) => {
    console.log('[START] Beginning DZI upload to S3...')

    await createFolderIfNotExist(s3Path);

    const readFiles = util.promisify(dir.files);
    const files = await readFiles(localPath);
    const total_files = files.length;
    let count=0;
    for (const file of files) {
        const nameArray = file.split('\\').slice(-2);

        if (nameArray[1] === 'vips-properties.xml') continue;

        const s3FileKey = `${s3Path}${nameArray[0]}/${nameArray[1]}`;
        await uploadImage(s3FileKey,fs.createReadStream(file))

        count += 1;
        console.log(`[${count}/${total_files}] Uploaded ${s3FileKey}...`);
    }
    console.log('[DONE] Successfully uploaded DZI to S3.')

    const Url = process.env.S3_PREFIX + s3Path;
    return Url;
}