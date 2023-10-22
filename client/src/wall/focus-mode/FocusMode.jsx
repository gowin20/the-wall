import Details from "./Details";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Controls from "./Controls";
import NoteView from "./NoteView";
import { getNote } from "../../api/wall";
import './focusMode.css';
import EditDetails from "./EditDetails";
import { useLoaderData } from "react-router-dom";
import { setFocusByNote } from "../wallSlice";

export async function loader({params}) {
    const noteObj = await getNote(params.noteId);
    return {noteObj};
}

export default function FocusMode() {
    const initialized = useSelector(state=>state.wall.focus.initialized);
    const layoutLoaded = useSelector(state=>state.wall.layoutLoaded);
    const editModeOn = useSelector((state)=>state.auth.editMode);
    const {noteObj} = useLoaderData();
    const dispatch = useDispatch();
    
    // Initialize focus mode when loading note from a URL
    useEffect(() => {
        if (layoutLoaded && !initialized) dispatch(setFocusByNote(noteObj._id));
    }, [layoutLoaded,initialized,noteObj]);

    let noteDetails;
    if (editModeOn) noteDetails = <EditDetails note={noteObj}/>
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