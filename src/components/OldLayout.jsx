import { getNotes } from "../lib/NoteInfo";
import Note from "./OldNote";

const MAX_WIDTH = 10;
const MAX_HEIGHT = 10;
const noteInfo = getNotes();
let noteHooks;
let focusedNote;

export function focusNote(note) {
    focusedNote = note;
    noteHooks[note](true);
}

export function clearFocus() {
    if (focusedNote) noteHooks[focusedNote](false);
    focusedNote = null;
}

export function Layout(props) {
    const renderNotes = [];
    noteHooks = {}


    // Create array of notes
    let x=0, y=0;


    const onNoteMount = noteData => {
        noteHooks[noteData[0]] = noteData[1]
    }

    Object.keys(noteInfo).forEach(key => {
        renderNotes.push(<Note id={key} key={key} position={[x,y,0]} url={key} clickFcn={props.clickFcn} onMount={onNoteMount}/>)
        if (x == MAX_WIDTH) {
            x=0;
            y++
        }
        else x++;
    })

    return renderNotes
}