import Details from "./Details";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Controls from "./Controls";
import NoteView from "./NoteView";
import { getNote } from "../../api/wall";
import './focusMode.css';
import EditDetails from "./EditDetails";
import { useLoaderData, useNavigate } from "react-router-dom";

export async function loader({params}) {
    const noteObj = await getNote(params.noteId);
    return {noteObj};
}

export default function FocusMode() {

    const editMode = useSelector((state)=>state.auth.editMode);
    const {noteObj} = useLoaderData();

    let noteDetails;
    if (editMode) noteDetails = <EditDetails note={noteObj}/>
    else noteDetails = <Details note={noteObj}/>

    if (noteObj) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView tilesId={noteObj.tiles}/>
            </div>    
            <div className='rightSide'>
                {noteDetails}
                <Controls />     
            </div>
            </div>
        </div>
        )
    else return <></>
}