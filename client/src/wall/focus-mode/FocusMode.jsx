import Details from "./Details";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Controls from "./Controls";
import NoteView from "./NoteView";
import { getNote } from "../../api/wall";
import './focusMode.css';


export default function FocusMode() {

    const noteID = useSelector((state)=>state.wall.focus.note);

    const [note,setNote] = useState(null);
    // TODO request note object in this component and pass details/url to the child components. avoid re-requests
    useEffect(()=>{
        async function getNoteObject() {
            const noteObj = await getNote(noteID);
            setNote(noteObj);
        }
        if (noteID) {
            getNoteObject();
        }
        else {
            setNote(null);
        }
    },[noteID])
    if (note) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView tilesId={note.tiles}/>
            </div>            
            <div className='rightSide'>
                <Details note={note}/>
                <Controls hidden={true} />     
            </div>
            </div>
        </div>
        )
    else return <></>
}