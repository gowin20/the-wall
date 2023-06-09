import sharp from "sharp";

const input = './public/wall-images/out.tiff';

sharp(input)
  .jpeg()
  .tile({
    size: 512
  })
  .toFile('./public/wall-images/test-25.dz', function(err, info) {
    console.log(err);
    console.log(info);
    // output.dzi is the Deep Zoom XML definition
    // output_files contains 512x512 tiles grouped by zoom level
  });