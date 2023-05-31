import React, { useState, useEffect } from 'react'
import { getNoteDetails } from "../middleware/util";
import "../css/main.css"

export default function Details({ note }) {
    
    if (!note) return <></>;

    const [details, setDetails] = useState(null);

    async function setupDetails(note) {
        const noteInfo = await getNoteDetails(note);
        setDetails(noteInfo);
    }

    useEffect(() => {
        setupDetails(note);
    }, [note])
    
    if (details) {
        let author,name,description;
        if (details.author) author = <h3 className="author">{details.author}</h3>;
        else author = <h3 className="author">anonymous</h3>
        if (details.name) name = <span className="name">{details.name}</span>;
        else name = <span className="name">untitled</span>;
        if (details.description) description = <span className="description">{details.description}</span>;
        let title;
        if (details.date) title = <p className="title">{name}, <span className="date">{details.date}</span></p>;
        else title = <p className="title">{name}</p>;
        
        return (
            <div className="details">
                <div className="detailsContent">
                    {author}
                    {title}
                    {description}
                </div>                
            </div>
        )
    }
    else return <></>;
}