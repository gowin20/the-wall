import Details from "./Details";
import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from "../../hooks";
import Controls from "./Controls";
import NoteView from "./NoteView";
import { getNote } from "../../api/wall";
import './focusMode.css';
import EditDetails from "./EditDetails";
import { useLoaderData } from "react-router-dom";
import { setFocusByNote } from "../wallSlice";
import { NoteObject } from "../wallTypes";

export async function loader({params}) {
    const noteObj = await getNote(params.noteId);
    return noteObj;
}

// TODO add props to this, use an outlet on wall to render this.
export default function FocusMode() {
    const initialized = useAppSelector(state=>state.wall.focus.initialized);
    const layoutLoaded = useAppSelector(state=>state.wall.layoutLoaded);
    const editModeOn = useAppSelector((state)=>state.auth.editMode);
    const noteObj = useLoaderData() as NoteObject;
    const dispatch = useAppDispatch();
    
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
                <Controls hidden={true} mode='swipe' />     
            </div>
            </div>
        </div>
        )
    else return <></>
}