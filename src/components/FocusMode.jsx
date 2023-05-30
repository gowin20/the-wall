import Details from "./Details";
import { useEffect, useState } from 'react';
import React from 'react';

export default function FocusMode({onMount, clearFocus}) {

    const [note, setNote] = useState(null);
    useEffect(()=>{
        onMount([note, setNote]);
    }, [note,onMount])

    const prefixUrl = 'https://the-wall-source.s3.us-west-1.amazonaws.com/notes/initial-test/';

    /*
        <button className="closeButton" onClick={closeDetails}>
        <svg viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/><line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/></svg>
        </button>
    */
   function closeFocusMode(e) {
        clearFocus();
   }
   console.log("current note: ",note);

    if (note) return (
        <div className='overlay'>
            <img src={prefixUrl+note} className='noteImage' alt={note}/>
            <div className="details">
                <Details/>
            </div>
            <div className='controls'>
                <div id='close' onClick={closeFocusMode}>
                    <svg width="100%" height="100%" fill="#C5C5C5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775">
                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                    </svg>
                </div>

            </div>          
        </div>
        )
    else return <></>
}