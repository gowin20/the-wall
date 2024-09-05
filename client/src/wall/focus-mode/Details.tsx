import React, { useState, useEffect, ReactElement } from 'react'
import { NoteInfo } from '../wallTypes';
import { CreatorName, UserObject } from '../../creators/creatorTypes';
import { useGetCreatorByIdQuery } from '../../creators/creatorsApi';




// This method is shared with EditDetails
const UNKNOWN_CREATOR_ID = '64f3db0f831d677c80b1726c';

export const initDetails = (note : NoteInfo) => {
    return {
        creator:note.creator? note.creator : UNKNOWN_CREATOR_ID, // Default to 'Unknown' if no ID
        title: note.title ? note.title : 'Untitled',
        date: note.date ? note.date : '',
        location: note.location ? note.location : '',
        details:note.details ? note.details : ''
    }
}


export default function Details({ note }) {
    
    if (!note) return <></>;

    const [details,setDetails] = useState<NoteInfo>(initDetails(note));
    const [creatorName,setCreatorName] = useState<CreatorName>('Unknown');
    const creatorId = note.creator ? note.creator : '66d9ede09e78fc6ab76fc927';  //ID for user 'Unknown'
    const {data,isFetching} = useGetCreatorByIdQuery(creatorId); 

    useEffect(()=>{
        if (data) setCreatorName(data.name ? data.name : 'Unknown');
    },[data]);

    useEffect(()=>{
        setDetails(initDetails(note));
    },[note])
    
    if (!details) return <></>;

    let placeTimeText : ReactElement = <></>;
    if (details.date) {
        if (details.location) {
            placeTimeText = <>{details.date}<pre style={{display:'inline'}}> | </pre>{details.location}</>
        }
        else {
            placeTimeText = <>{details.date}</>;
        }
    }
    else if (details.location) {
        placeTimeText = <>{details.location}</>;
    }

    return (
        <div className="details">
            <div className="detailsContent">
            <span className='title'>{creatorName}</span>
                <br></br>
                <span className="placeTime">{placeTimeText}</span>
                <br></br>
                <span className="artist">{details.title}</span>
                <br className='detailsBreak'></br>
                <span className="description">{details?.details}</span>
            </div>                
        </div>
    )
}