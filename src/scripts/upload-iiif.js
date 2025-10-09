import { createFolderIfNotExist, uploadImage } from "../s3/s3";


export const uploadIiifFolder = async (localPath,s3Path) => {
    console.log('[START] Beginning IIIF upload to S3...')

    await createFolderIfNotExist(s3Path);

    const readFiles = util.promisify(dir.files);
    const files = await readFiles(localPath);
    const total_files = files.length;
    let count=0;
    for (const file of files) {
        const s3FileKey = `${s3Path}${nameArray[0]}/${nameArray[1]}`;
        await uploadImage(s3FileKey,fs.createReadStream(file))

        count += 1;
        console.log(`[${count}/${total_files}] Uploaded ${s3FileKey}...`);
    }
    console.log('[DONE] Successfully uploaded DZI to S3.')

    const Url = process.env.S3_ADDRESS + s3Path;
    return Url;
}