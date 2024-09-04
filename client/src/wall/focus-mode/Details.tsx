import React, { useState, useEffect } from 'react'
import { getUserById } from '../../api/user';
import { NoteInfo } from '../wallTypes';
import { UserObject } from '../../creators/creatorTypes';

type Creator = string;

export default function Details({ note }) {
    
    if (!note) return <></>;

    const initNoteDetails = (note) => {
        return {
            creatorId:note.creatorId,
            title:note.title? note.title : 'Untitled',
            date:note?.date,
            location:note?.location,
            details:note?.details
        }
    }

    const [details,setDetails] = useState<NoteInfo>(initNoteDetails(note));
    const [creator,setCreator] = useState<Creator>('Unknown');

    useEffect(() => {
        async function initDetails() {
            let user:UserObject;
            if (note.creator) {
                // fetch user
                user = await getUserById(note.creator);
                setCreator(user.name);
            }
            else {
                setCreator('Unknown');
            }
        }

        if (note) {
            initDetails();
        }
    },[note])
    
    if (details) {
        let placeTime, description;

        const creatorHtml = <span className='title'>{creator}</span>;
        const title = <span className="artist">{details.title}</span>;


        if (details.date || details.location) {
            let placeTimeText;

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
            placeTime = <span className="placeTime">{placeTimeText}</span>;
        }

        if (details.details) description = <span className="description">{details.details}</span>;

        return (
            <div className="details">
                <div className="detailsContent">
                    {creatorHtml}
                    <br></br>
                    {placeTime}
                    <br></br>
                    {title}
                    <br className='detailsBreak'></br>
                    {description}
                </div>                
            </div>
        )
    }
    else return <></>;
}