import sharp from "sharp";

const input = './public/wall-images/out.tiff';

sharp(input)
  .png()
  .tile({
    size: 512
  })
  .toFile('./public/wall-images/output.dz', function(err, info) {
    console.log(err);
    console.log(info);
    // output.dzi is the Deep Zoom XML definition
    // output_files contains 512x512 tiles grouped by zoom level
  });