import React from 'react';

export default function Controls({buttons, location, clearNote, changeNote}) {

    // TODO disble close button on mobile, otherwise always included 

    console.log(buttons)

    function moveFocus(direction) {
        switch(direction) {
            case 'up':
                changeNote(location[0]-1,location[1]);
                break;
            case 'down':
                changeNote(location[0]+1,location[1]);
                break;
            case 'left':
                changeNote(location[0],location[1]-1);
                break;
            case 'right':
                changeNote(location[0],location[1]+1);
                break;
            default:
                console.log('should never reach here');
                break;
        }
   }
    
    const arrowIcons = {
        'up':{
            viewBox:'0 0 14 11',
            path:<><path d="M1 9L7 2" strokeWidth="2" strokeLinecap="round"/><path d="M13 9L7 2" strokeWidth="2" strokeLinecap="round"/></>
        },
        'down':{
            viewBox:'0 0 14 11',
            path:<><path d="M13 2L7 9" strokeWidth="2" strokeLinecap="round"/><path d="M1 2L7 9" strokeWidth="2" strokeLinecap="round"/></>
        },
        'left':{
            viewBox:'0 0 11 14',
            path:<><path d="M9 13L2 7" strokeWidth="2" strokeLinecap="round"/><path d="M9 1L2 7" strokeWidth="2" strokeLinecap="round"/></>
        },
        'right':{
            viewBox:'0 0 11 14',
            path:<><path d="M2 1L9 7" strokeWidth="2" strokeLinecap="round"/><path d="M2 13L9 7" strokeWidth="2" strokeLinecap="round"/></>
        }
    }

    const arrowButtons = Object.keys(arrowIcons).map((direction) => {
        return (
            <div key={direction} className={direction + ' control'} onClick={()=> buttons[direction] ? moveFocus(direction) : ''}>
                <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' stroke={buttons[direction] ? '#C5C5C5' : '#999999'} viewBox={arrowIcons[direction].viewBox}>
                    {arrowIcons[direction].path}
                </svg>
            </div>
        )
    })
    return (
        <div className='controls'>
            <div className='close control' onClick={()=>clearNote()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" stroke="#C5C5C5" viewBox="0 0 14 16">
                    <path d="M1 2L13 14" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 14L13 2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
            {arrowButtons}
        </div>
    )
}