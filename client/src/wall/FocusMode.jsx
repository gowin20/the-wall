import Details from "./Details";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Controls from "./Controls";
import NoteView from "./NoteView";
import './focusMode.css';


export default function FocusMode() {

    const noteID = useSelector((state)=>state.wall.focus.note);

    // TODO request note object in this component and pass details/url to the child components. avoid re-requests
/*
    const url = await getNote();
    async function getNote() {
        if note.id === null return;
    
    }
  */  

    if (noteID) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView noteUrl={noteID}/>
            </div>            
            <div className='rightSide'>
                <Details note={noteID}/>
                <Controls />     
            </div>
            </div>
        </div>
        )
    else return <></>
}