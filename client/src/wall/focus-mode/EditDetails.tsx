import React, {useState,useEffect} from "react";
import CreatorSelector from "../../creators/CreatorSelector";
import { patchNote } from "../wallActions";
import { useAppDispatch } from "../../hooks";
import { disableControls,enableControls } from "../wallSlice";
import { NoteInfo } from "../wallTypes";

const UNKNOWN_CREATOR_ID = '64f3db0f831d677c80b1726c';

interface NoteDetails {
    creatorId:string;
}

const EditDetails = ({ note }) => {
    if (!note) return <></>;

    useEffect(() =>{
        setDetails({
            creatorName:null,
            creatorId:note.creator? note.creator : '',
            title: note.title ? note.title : '',
            date: note.date ? note.date : '',
            location: note.location ? note.location : '',
            details:note.details ? note.details : ''
        })
    },[note])

    const [details,setDetails] = useState<NoteInfo>({
        creatorName:null,
        creatorId:note.creator? note.creator : UNKNOWN_CREATOR_ID, // Default to 'Unknown' if no ID
        title: note.title ? note.title : '',
        date: note.date ? note.date : '',
        location: note.location ? note.location : '',
        details:note.details ? note.details : ''
    });
    const dispatch = useAppDispatch();


    if (!details) return <></>;
    const noteId = note._id;
    const postEdits = (e) => {
        e.preventDefault();
        console.log('ACTUALLY POSTING EDITS')
        //if (details.id || details.orig || details.thumbnails || details.tiles) return console.error('Cannot edit protected value.');

        const creatorId = e.target[0].value;
        let newNoteInfo : NoteInfo = {
            creatorName:null,
            creatorId,
            title: details?.title,
            date:details?.date,
            location:details?.location,
            details:details?.details
        };

        
        //console.log(noteId,noteInfo);
        dispatch(patchNote({_id:noteId, info:newNoteInfo}))
        setDetails({
            ...details,
            creatorId:creatorId
        })
    }

    return (
        <div className="details">
            <div className="detailsContent">
                <form onSubmit={postEdits} onFocus={e=>dispatch(disableControls())} onBlur={e=>dispatch(enableControls())}>
                    <CreatorSelector creatorId={details.creatorId}/>
                    <input className='title' type='text' value={details.title} onChange={e=>setDetails({...details, title:e.target.value})} placeholder="Title"/>
                    <input className="placeTime" type='text' value={details.location} onChange={e=>setDetails({...details, location:e.target.value})} placeholder="Location"/>
                    <input className="placeTime" type='text' value={details.date} onChange={e=>setDetails({...details, date:e.target.value})} placeholder="Date"/>
                    <textarea className='description' type='text' value={details.description} onChange={e=>setDetails({...details, description:e.target.value})} placeholder="Description"/>
                    <input className='saveEdits' type='submit' value='Save edits'/>
                </form>
            </div>
        </div>
    )
}

export default EditDetails;