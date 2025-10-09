import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT) | 5050;
const S3_ADDRESS = process.env.S3_ADDRESS as string;

const S3_IIIF_PREFIX = process.env.S3_IIIF_PREFIX;
const S3_ART_PREFIX = process.env.S3_ART_PREFIX;

const S3_BUCKET = process.env.BUCKET;
const S3_REGION = process.env.S3_REGION;

const S3_iiifTemplate = `${S3_ADDRESS}${S3_IIIF_PREFIX}\{id\}`;
const S3_artTemplate = `${S3_ADDRESS}${S3_ART_PREFIX}\{id\}`;

export {
    port,
    S3_ADDRESS,
    S3_BUCKET,
    S3_REGION,
    S3_IIIF_PREFIX,
    S3_ART_PREFIX, 
    S3_artTemplate
};