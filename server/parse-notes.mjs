import {
    S3Client,
    // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
    ListObjectsV2Command,
  } from "@aws-sdk/client-s3";
import * as fs from 'fs';
  
const client = new S3Client({
  region:'us-west-1'
});

export const listNotes = async () => {
  const command = new ListObjectsV2Command({
    Bucket: "the-wall-source",
    Prefix: "notes/orig/",
    // The default and maximum number of keys returned is 1000.
  });

  try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n")
    let notes = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);

      const contentList = (Contents.map((c)=>c.Key));
      notes.push.apply(notes,contentList);

      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return notes;
  } catch (err) {
    console.error(err);
  }
};


const notes = await listNotes();

console.log(notes);
fs.writeFileSync('./output.json',JSON.stringify(notes));