import {
    S3Client,
    // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
    ListObjectsV2Command,
  } from "@aws-sdk/client-s3";
import * as fs from 'fs';
  
const client = new S3Client({
  region:'us-west-1'
});

export const listFolder = async (folder,options) => {

  const command = new ListObjectsV2Command({
    Bucket: "the-wall-source",
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

export const uploadNote = async (path,options) => {
  // TODO
}

export const uploadNotesBulk = async (path,options) => {
  // TODO
}

export const uploadLayout = async (path,options) => {
  // TODO
}

export const deleteNote = async (path,options) => {
  // TODO
}