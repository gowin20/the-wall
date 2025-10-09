import { Processor, IIIFError } from 'iiif-processor';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_BUCKET, S3_IIIF_PREFIX } from '../loadEnvironment.js';
import { Router } from 'express';

const streamImageFromS3 = async ({ id }: { id: string }): Promise<ReadableStream> => {

  const client = new S3Client({
    region:'us-west-1'
  });
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: `${S3_IIIF_PREFIX}${id}`
  });

  const response = await client.send(command);
  const body = response.Body;

  if (!body) throw new IIIFError(`Unable to stream image from ${id}`, { statusCode: 404 })

  return body as ReadableStream;
};

const render = async (req: any, res: any) => {
  if (req.params && req.params.filename == null) {
    req.params.filename = 'info.json';
  }

  const iiifUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  const iiifProcessor = new Processor(iiifUrl, streamImageFromS3, {
    pathPrefix: S3_IIIF_PREFIX,
    debugBorder: !!process.env.DEBUG_IIIF_BORDER
  });
  const result = await iiifProcessor.execute();
  return res
    .set('Content-Type', result.contentType)
    .set('Link', [`<${(result as any).canonicalLink}>;rel="canonical"`, `<${(result as any).profileLink}>;rel="profile"`])
    .status(200)
    .send(result.body);
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
router.get('/', (_req, res) => res.status(200).send(`IIIF v3.0.0 endpoint OK`));
router.get('/:id', render);
router.get('/:id/info.json', render);
router.get('/:id/:region/:size/:rotation/:filename', render);

export default router;