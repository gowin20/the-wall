import Details from "./Details";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Controls from "./Controls";
import NoteView from "./NoteView";
import { getNote } from "../../api/wall";
import './focusMode.css';
import EditDetails from "./EditDetails";

export default function FocusMode() {

    const noteID = useSelector((state)=>state.wall.focus.note);
    const editMode = useSelector((state)=>state.auth.editMode);
    if (noteID) console.log(`Note ID: ${noteID}`)
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
    let noteDetails;
    if (editMode) noteDetails = <EditDetails note={note}/>
    else noteDetails = <Details note={note}/>


    if (note) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView tilesId={note.tiles}/>
            </div>            
            <div className='rightSide'>
                {noteDetails}
                <Controls hidden={true} />     
            </div>
            </div>
        </div>
        )
    else return <></>
}