import Details from "./Details";
import React, { useEffect, useState } from 'react';
import Controls from "./Controls";

export default function FocusMode({onMount, clearNote, changeNote}) {

    const [note, setNote] = useState({
        url:null, // url of a note image (ex 'bloom.png')
        location:null, // coordinates of the focused note in the current layout
        buttons:null // object determining which control buttons are enabled
    });
    useEffect(()=>{
        onMount([note, setNote]);
    }, [note,onMount])

    const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/initial-test/';

    if (note.url) return (
        <div className='overlay'>
            <img src={prefixUrl+note.url} className='noteImage' alt={note}/>
            <Details note={note.url}/>
            <Controls buttons={note.buttons} location={note.location} clearNote={clearNote} changeNote={changeNote}/>          
        </div>
        )
    else return <></>
}