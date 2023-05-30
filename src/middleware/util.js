import SampleNotes from "../data/notes/sample-notes-2.json" assert { type: "json" };
import SmallSampleNotes from "../data/notes/small-sample-notes.json" assert { type: "json" };
import SampleLayout from "../data/layouts/sample-layout.json" assert { type: "json" };

let notes = SampleNotes;
const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/';


export function getAllNotes(props=null) {
    if (props === "sample") {
        return SampleNotes;
    }
    else if (props === "small-sample") {
        return SmallSampleNotes;
    }

    return notes;
}

export async function getNoteDetails(url) {
    return notes[url];
}

export async function getLayout(name=null) {
    let layout;
    if (name === null || name === 'default') {
        layout = SampleLayout;
        const dzi = await getTest25();
        layout.image.dzi = dzi;
    }
    return layout;
}

export async function getTest25() {

    const response = await fetch(prefixUrl+'layouts/test-25/schema.json');
    const testDZI = await response.json();
    testDZI.Image.Overlap = 1;
    const url = prefixUrl + 'layouts/test-25/test-25_files/'
    testDZI.Image.Url = url;
    return testDZI;
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
