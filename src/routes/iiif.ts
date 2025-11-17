import { IIIF_IMAGE_PREFIX, S3_ADDRESS, DEFAULT_NOTES_MANIFEST_URL } from '../loadEnvironment.js';
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


/**
 * IIIF Presentation service v3
 * Serves manifest and collection JSON objects that comply with the Presentation API v3
 */
const serviceV3 = Router();
serviceV3.get('/', (_req, res) => res.status(200).send(`IIIF endpoint OK`));

serviceV3.get('/manifests', (_req, res) => res.status(200).send(`IIIF Manifest endpoint OK -- Presentation API 3.0.0`))

serviceV3.get('/manifests/:id', (req,res) => {
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
});

/**
 * IIIF Image service V2
 * Serves image tiles and info.json objects from service-compliant directories
 */
const serviceV2 = Router();
serviceV2.get('/',(_req, res) => res.status(200).send(`IIIF Image service endpoint OK -- Image API 2.0.0`))

const sendImageInfo = (req,res) => {
    res.sendFile(`${IIIF_IMAGE_PREFIX}/${req.params.id}/info.json`, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error serving file.');
        } else {
            console.log('File sent successfully.');
        }
    });
}

serviceV2.get('/:id', (req, res) => {
    // ID = '+tiles'
    sendImageInfo(req,res);
});

serviceV2.get('/:id/info.json', (req, res) => {
    sendImageInfo(req,res);
});

// https://the-wall-source.s3.us-west-1.amazonaws.com/iiif/2/default-test+tiles

// Requesting an image
serviceV2.get('/:id/:region/:size/:rotation/:filename', (req, res) => {
    // Assume that :id is the correct ID of an image service
    // return file directly
    res.sendFile(`${IIIF_IMAGE_PREFIX}/${req.path}`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error serving file.');
      } else {
        console.log(`Served ${req.path}`);
      }
    });

})


router.use('/3', serviceV3);
router.use('/2', serviceV2);

export default router;