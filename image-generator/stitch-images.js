import SampleLayout from "../src/data/layouts/sample-layout.json" assert { type: "json" };
import mergeImages from "merge-images"; 
import {Canvas, Image} from 'canvas';
import * as fs from 'fs';

const layout = SampleLayout;
const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/initial-test/';

// width and height of notes in pixels
const noteDims = 2884;
const finalHeight = layout.array.length * noteDims;
const finalWidth = layout.array[0].length * noteDims;

const order = [];

for (const [i,row] of layout.array.entries()) {
    for (const [j, url] of row.entries()) {
        order.push({
            src: prefixUrl+url,
            y: i*noteDims,
            x: j*noteDims
        })
    }
}

console.log(order);

mergeImages(order, {
    Canvas:Canvas,
    Image:Image,
    width: finalWidth,
    height: finalHeight,
    format: 'image/tiff'
})
.then(b64 => {
    //console.log(b64)
    var rawData = b64.replace(/^data:image\/png;base64,/, "");

    fs.writeFile("./public/wall-images/out.tiff", rawData, 'base64', function(err) {
        console.log(err);
    });
})