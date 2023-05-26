import SampleNotes from "../sample-notes-2.json";
import SmallSampleNotes from "../small-sample-notes.json";

export function getNotes(props=null) {
    if (props === "sample") {
        return SampleNotes
    }
    else if (props === "small-sample") {
        return SmallSampleNotes
    }

    return SampleNotes;
}

export function getLayout() {
    const layout = {
        grid:[
        ['00','01','02'],
        ['10','11','12'],
        ['20','21','22']
        ],
        url:''
    }
    return layout;
}


export async function getSampleImages() {
    const response = await fetch("https://openslide-demo.s3.dualstack.us-east-1.amazonaws.com/info.json")
    let image = await response.json();
    return image.groups[0].slides[0].slide;
}