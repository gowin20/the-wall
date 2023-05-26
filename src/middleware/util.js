import SampleNotes from "../data/notes/sample-notes-2.json" assert { type: "json" };
import SmallSampleNotes from "../data/notes/small-sample-notes.json" assert { type: "json" };
import SampleLayout from "../data/layouts/sample-layout.json" assert { type: "json" };

let notes = SampleNotes;
let layout = SampleLayout;
const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';


export function getAllNotes(props=null) {
    if (props === "sample") {
        return SampleNotes
    }
    else if (props === "small-sample") {
        return SmallSampleNotes
    }

    return notes;
}

export function getNoteDetails(url) {
    return notes[url];
}

export async function getLayout(name=null) {
    if (name === null) return;
    else if (name === 'default') {
        const dzi = await getTest25();
        layout.image.dzi = dzi
    }
    return layout;
}

export function getPositionInLayout(noteUrl, layout) {
    for (const [i,row] of layout.array.entries()) {
        for (const [j,url] of row.entries()) {
            if (noteUrl === url) return [i,j];
        }
    }
    return null;
}

//export function setPositionInLayout(note, layout, row,col)

export async function getSampleImage() {
    const response = await fetch("https://openslide-demo.s3.dualstack.us-east-1.amazonaws.com/info.json")
    let image = await response.json();
    
    return image.groups[0].slides[0].slide;
}

export async function getTest25() {

    const response = await fetch(prefixUrl+'layouts/test-25/schema.json');
    const testDZI = await response.json();

    const url = prefixUrl + 'layouts/test-25/output_files/'
    testDZI.Image.Url = url;
    return testDZI;
}