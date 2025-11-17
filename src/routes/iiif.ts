
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_BUCKET, S3_IIIF_PREFIX, S3_ADDRESS, DEFAULT_NOTES_MANIFEST_URL } from '../loadEnvironment.js';
import { Router } from 'express';

const streamImageFromS3 = async ({ id, baseUrl }: { id: string, baseUrl: string }): Promise<ReadableStream> => {
  /*
  const client = new S3Client({
    region:'us-west-1'
  });
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: `${S3_IIIF_PREFIX}${id}`
  });
  */
  const S3_URL = baseUrl+id;
  console.log('URL:',S3_URL);
  const response = await fetch(S3_URL);
  const body = (await response.blob()).stream();
  return body as ReadableStream;
};

const router = Router();

router.use((_req, res, next) => {
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

router.options('*', (_req, res) => {
  res.status(204).send('');
});
router.get('/', (_req, res) => res.status(200).send(`IIIF endpoint OK`));

router.get('/manifests', (_req, res) => res.status(200).send(`IIIF Manifest endpoint OK -- Presentation API 3.0.0`))

router.get('/2',(_req, res) => res.status(200).send(`IIIF Image service endpoint OK -- Image API 2.0.0`))

router.get('/manifests/:id', (req,res) => {
  const manifestResult = {
    manifestUrl: ''
  }
  
  if (req.params.id === 'default') {
    console.log('Serving default manifest')
    manifestResult.manifestUrl = DEFAULT_NOTES_MANIFEST_URL
  }
  else {
    console.log('Serving manifest with ID:',req.params.id);
    manifestResult.manifestUrl = `${S3_ADDRESS}iiif/manifests/${req.params.id}`
  }


  res.status(200).send(manifestResult);
})

export default router;