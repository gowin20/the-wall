import Details from "./Details";
import React, { useEffect, useState } from 'react';
import Controls from "./Controls";
import NoteView from "./NoteView";
import '../css/focusMode.css';

export default function FocusMode({onMount, clearNote, changeNote}) {

    const [note, setNote] = useState({
        id:null, // url of a note image (ex 'bloom.png')
        location:null, // coordinates of the focused note in the current layout
        buttons:null // object determining which control buttons are enabled
    });
    useEffect(()=>{
        onMount([note, setNote]);
    }, [note,onMount])

    // please implement redux before coming back to this. remove those silly onMounts
    const url = await getNote();
    async function getNote() {
        if note.id === null return;
    
    }
    

    if (note.url) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView noteUrl={note.url}/>
            </div>            
            <div className='rightSide'>
                <Details note={note.url}/>
                <Controls buttons={note.buttons} location={note.location} clearNote={clearNote} changeNote={changeNote}/>     
            </div>
            </div>
        </div>
        )
    else return <></>
}