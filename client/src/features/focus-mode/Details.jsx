import React, { useState, useEffect } from 'react'
import { getNoteDetails } from "../../middleware/util";

export default function Details({ note }) {
    
    if (!note) return <></>;

    const [details, setDetails] = useState(null);

    async function setupDetails(note) {
        const noteInfo = await getNoteDetails(note);
        setDetails(noteInfo);
    }

    useEffect(() => {
        console.log(note);
        setupDetails(note);
    }, [note])
    
    if (details) {
        let title, placeTime, artist, description;
        if (details.title) title = <span className="title">{details.title}</span>;
        else title = <span className='title'>Untitled</span>;

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

        if (details.artist) artist = <span className='artist'>{details.artist}</span>;
        else artist = <span className='artist'>Anonymous</span>;

        if (details.description) description = <span className="description">{details.description}</span>;

        return (
            <div className="details">
                <div className="detailsContent">
                    {title}
                    <br></br>
                    {placeTime}
                    <br></br>
                    {artist}
                    <br className='detailsBreak'></br>
                    {description}
                </div>                
            </div>
        )
    }
    else return <></>;
}