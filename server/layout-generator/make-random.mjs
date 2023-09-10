import { getAllNotes } from "../db/crud-notes.mjs";

// Create random 2d array of note ids
export const makeRandomPattern = async (notes, options) => {

    console.log('Creating random pattern...')

    if (!notes) throw new Error('No notes provided to \'makeRandomPattern()\'');

    const totalNotes = notes.length;

    let width, height;
    if (options.rows && options.cols) { // Use number of rows and cols if available
        width = options.cols;
        height = options.rows;
        // TODO edge case of "more notes than available space in layout"
    }
    else { // Otherwise use a ratio instead (Default 16:9)
        const ratio = options.ratio ? options.ratio : 16/9;
        height = Math.ceil(Math.sqrt(totalNotes/ratio));
        width = Math.ceil(height*ratio);
    
        if ((width-2)*height >= totalNotes) width -= 2;
        if ((width-1)*height >= totalNotes) width -= 1;
        if (width*(height-1) >= totalNotes) height -= 1;
    }

    const pattern = [];
    const usedNotes = new Set();

    for (let row=0;row<height;row++) {
        const thisRow = [];
        for (let col=0;col<width;col++) {
            if (usedNotes.size >= totalNotes) {
                break;
            }
   
            let i;
            do {
                i = Math.floor(Math.random()*totalNotes);
            } while (usedNotes.has(i));
    
            thisRow.push(notes[i])
            usedNotes.add(i);
        }
        pattern.push(thisRow);
    }

    console.log(`New pattern generated.\nWidth:${pattern[0].length}\nHeight: ${pattern.length}`);
    return pattern;
}