import Details from "./Details";
import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from "../../hooks";
import Controls from "./Controls";
import NoteView from "./NoteView";
import './focusMode.css';
import EditDetails from "./EditDetails";
import { useLoaderData } from "react-router-dom";
import { setFocusByNote } from "../wallSlice";
import { NoteObject } from "../wallTypes";
import { useNoteId } from "../Wall";
import { store } from "../../store";
import { wallApi } from "../wallApi";

export async function loader({params}) {
    const {data} = await store.dispatch(wallApi.endpoints.getNote.initiate(params.noteId));
    if (data) {
        return data;
    }
}

export default function FocusMode() {
    const initialized = useAppSelector(state=>state.wall.focus.initialized);
    const layoutLoaded = useAppSelector(state=>state.wall.layoutLoaded);
    const editModeOn = useAppSelector((state)=>state.auth.editMode);
    const noteObj = useLoaderData() as NoteObject;
    const dispatch = useAppDispatch();

    const noteId = useNoteId();

    //const {data, isLoading} = useGetNoteQuery(paramsnoteId);
    
    // Initialize focus mode when loading note from a URL
    useEffect(() => {
        if (layoutLoaded && !initialized) dispatch(setFocusByNote(noteObj._id));
    }, [layoutLoaded,initialized,noteObj]);

    let noteDetails;
    if (editModeOn) noteDetails = <EditDetails note={noteObj} noteId={noteObj._id}/>
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