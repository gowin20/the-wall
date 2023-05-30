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

    /*
        <button className="closeButton" onClick={closeDetails}>
        <svg viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/><line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/></svg>
        </button>
    */
    if (note.url) return (
        <div className='overlay'>
            <img src={prefixUrl+note.url} className='noteImage' alt={note}/>
            <Details note={note.url}/>
            <Controls buttons={note.buttons} location={note.location} clearNote={clearNote} changeNote={changeNote}/>          
        </div>
        )
    else return <></>
}