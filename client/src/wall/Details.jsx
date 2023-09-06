import React, { useState, useEffect } from 'react'
import { getUserById } from '../api/user';

export default function Details({ note }) {
    
    if (!note) return <></>;

    const [details,setDetails] = useState(null);

    useEffect(() => {
        async function initDetails() {
            let user;
            if (note.creator) {
                // fetch user
                user = await getUserById(note.creator);
            }

            setDetails({
                creator:user ? user.name : 'Unknown',
                title: note.title ? note.title : 'Untitled',
                date: note.date ? note.date : null,
                location: note.location ? note.location : null,
                description:note.details ? note.details : null
            })
        }

        if (note) {
            initDetails();
        }
    },[note])
    
    if (details) {
        let placeTime, description;

        const creator = <span className='title'>{details.creator}</span>;
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

        if (details.description) description = <span className="description">{details.description}</span>;

        return (
            <div className="details">
                <div className="detailsContent">
                    {creator}
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