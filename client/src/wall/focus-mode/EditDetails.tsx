import React, {useState,useEffect, SyntheticEvent} from "react";
import CreatorSelector from "../../creators/CreatorSelector";
import { useAppDispatch } from "../../hooks";
import { disableControls,enableControls } from "../wallSlice";
import { NoteId, NoteInfo } from "../wallTypes";
import { initDetails } from "./Details";
import { usePatchNoteMutation } from "../wallApi";
interface DetailsProps {
    note: NoteInfo;
    noteId: NoteId;
}

const EditDetails = ({note,noteId} : DetailsProps) => {
    if (!note) return <></>;

    const [details,setDetails] = useState<NoteInfo>(initDetails(note));
    const [triggerEdit] = usePatchNoteMutation();
    if (!details) return <></>;

    const dispatch = useAppDispatch();
    useEffect(()=>{
        setDetails(initDetails(note));
    },[note])

    /*
    Post edits: posts edits as a PATCH request to the server

    */
    const postEdits = (e : SyntheticEvent) => {
        e.preventDefault();
        //if (details.id || details.orig || details.thumbnails || details.tiles) return console.error('Cannot edit protected value.');
        console.log('Patching note',noteId,':',details);
        triggerEdit({noteId:noteId, info:details});
    }

    return (
        <div className="details">
            <div className="detailsContent">
                <form onSubmit={postEdits} onFocus={e=>dispatch(disableControls())} onBlur={e=>dispatch(enableControls())}>
                    <CreatorSelector creatorId={details.creator} currentDetails={details} updateDetails={setDetails}/>
                    <input className='title' type='text' value={details.title as string} onChange={e=>setDetails({...details, title:e.target.value})} placeholder="Title"/>
                    <input className="placeTime" type='text' value={details.location as string} onChange={e=>setDetails({...details, location:e.target.value})} placeholder="Location"/>
                    <input className="placeTime" type='text' value={details.date as string} onChange={e=>setDetails({...details, date:e.target.value})} placeholder="Date"/>
                    <textarea className='description' value={details.details as string} onChange={e=>setDetails({...details, details:e.target.value})} placeholder="Description"/>
                    <input className='saveEdits' type='submit' value='Save edits'/>
                </form>
            </div>
        </div>
    )
}

export default EditDetails;