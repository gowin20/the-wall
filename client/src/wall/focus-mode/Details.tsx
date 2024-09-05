import React, { useState, useEffect, ReactElement } from 'react'
import { getUserById } from '../../api/user';
import { NoteInfo } from '../wallTypes';
import { CreatorName, UserObject } from '../../creators/creatorTypes';




// This method is shared with EditDetails
const UNKNOWN_CREATOR_ID = '64f3db0f831d677c80b1726c';

export const initDetails = (note : NoteInfo) => {
    console.log('Initializing details:',note)
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

    useEffect(() => {
        async function fetchCreator() {
            let user:UserObject;
            if (note.creator) {
                // fetch user
                user = await getUserById(note.creator);
                setCreatorName(user.name);
            }
            else {
                setCreatorName('Unknown');
            }
        }

        if (note) {
            setDetails(initDetails(note));
            fetchCreator();
        }
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