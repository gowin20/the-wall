import React, { useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "../../hooks";
import { store } from "../../store";
import { setFocusByNote } from "../wallSlice";
import { NoteObject } from "../wallTypes";
import { wallApi } from "../wallApi";
import Controls from "./Controls";
import NoteView from "./NoteView";
import EditDetails from "./EditDetails";
import Details from "./Details";
import './focusMode.css';

/**
 * Loader function fetches information about the current note ID.
 * @param params.noteId - the NoteId of the currently focused note. Should never be null. 
 * @returns NoteObject containing info about the current note.
 */
export async function loader({params}) {
    const {data} = await store.dispatch(wallApi.endpoints.getNote.initiate(params.noteId));
    if (data) {
        return data;
    }
}

/**
 * Focus mode: The wall overlay that appears when a note is selected.
 * @returns The DOM element for focus mode
 */
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

    if (noteObj) return (
        <div className='overlay'>
            <div className='overlayContents'>
            <div className='leftSide'>
                <NoteView tilesId={noteObj.tiles}/>
            </div>    
            <div className='rightSide'>
                {editModeOn 
                ? <EditDetails note={noteObj} noteId={noteObj._id}/>
                : <Details note={noteObj}/>}
                <Controls hidden={true} mode='swipe' />     
            </div>
            </div>
        </div>
        )
    else return <></>
}