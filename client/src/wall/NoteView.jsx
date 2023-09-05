import React, { useEffect } from 'react';

export default function NoteView({noteUrl}) {

    if (!noteUrl) return <></>;


    return (
        <img src={noteUrl} className='noteImage' alt={noteUrl}/>
    )
}