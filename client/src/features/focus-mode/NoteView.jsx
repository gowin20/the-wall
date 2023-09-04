import React, { useEffect } from 'react';

export default function NoteView({noteUrl}) {

    if (!noteUrl) return <></>;

    const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/initial-test/';

    return (
        <img src={prefixUrl+noteUrl} className='noteImage' alt={noteUrl}/>
    )
}