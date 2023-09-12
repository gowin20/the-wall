import {
    S3Client,
    // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
    ListObjectsV2Command,
    PutObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand
  } from "@aws-sdk/client-s3";
import * as fs from 'fs';

const client = new S3Client({
  region:'us-west-1'
});

const BUCKET = 'the-wall-source';
const S3_ADDRESS = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';

export const listFolder = async (folder,options) => {

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

    if (options.saveFile) {
      fs.writeFileSync('../temp/s3-output.json',JSON.stringify(noteList));
    }
    return noteList.notes;
  } catch (err) {
    console.error(err);
  }
};

// Key: folder/in/bucket/

async function createFolder(Key) {
  const command = new PutObjectCommand({
    Bucket: BUCKET, 
    Key: Key
  });
  return await client.send(command);
}

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

export async function emptyDirectory(dir) {
  // Prevent disaster from occurring
  if (Key === '/notes' || Key === '/layout') {
    throw new Error('Cannot delete contents of root directories');
  }

  const listParams = {
    Bucket: BUCKET,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

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