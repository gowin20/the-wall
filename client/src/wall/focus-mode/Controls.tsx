import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from "../../hooks";
import { setFocusByPosition, clearFocus } from '../wallSlice';
import { useNavigate } from 'react-router-dom';

interface ControlProps {
    hidden: boolean;
    mode: 'arrows' | 'swipe'   
}

export default function Controls(props : ControlProps) {

    // current position on wall
    const position = useAppSelector((state) => state.wall.focus.position);
    const enabled = useAppSelector(state=>state.wall.focus.controlsEnabled);
    const layoutSize = useAppSelector((state) => ({rows:state.wall.layout.numRows,cols:state.wall.layout.numCols}))
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // Determine what buttons are disabled based on current position/layout
    const buttons = {
        up:(position.row > 0),
        down:(position.row < layoutSize.rows-1),
        left:(position.col > 0),
        right:(position.col < layoutSize.cols-1)
    }
    
    // TODO fix the CSS of this class along with the rest of focus mode

    useEffect(() => {
        function keyboardEvent(e) {
            if (enabled) moveFocus(e.code);
        }
        window.addEventListener('keydown', keyboardEvent);
        return () => {
            window.removeEventListener('keydown',keyboardEvent);
        }
    })

    const setFocus = (row,col) => {
        dispatch(setFocusByPosition({
            row:row,
            col:col
        }));
    }
    const closeFocusMode = () => {
        dispatch(clearFocus());
        navigate('..'); // Up one level in the router heirarchy (e.g. back to the current wall view)
    }

    function moveFocus(direction) {
        switch(direction) {
            case 'up':
            case 'ArrowUp':
                setFocus(position.row-1,position.col)
                break;
            case 'down':
            case 'ArrowDown':
                setFocus(position.row+1,position.col)
                break;
            case 'left':
            case 'ArrowLeft':
                setFocus(position.row,position.col-1)
                break;
            case 'right':
            case 'ArrowRight':
                setFocus(position.row,position.col+1)
                break;
            case 'Escape':
                closeFocusMode();
                break;
            default:
                break;
        }
    }

    if (props.hidden) {
        return <></>
    }
    
    let arrowButtons;
    if (props.mode === 'arrows') {
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
        arrowButtons = Object.keys(arrowIcons).map((direction) => {
            return (
                <div key={direction} className={direction + ' control'} onClick={()=> buttons[direction] ? moveFocus(direction) : ''}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' stroke={buttons[direction] ? '#C5C5C5' : '#666'} viewBox={arrowIcons[direction].viewBox}>
                        {arrowIcons[direction].path}
                    </svg>
                </div>
            )
        })
    }
    
    return (
        <div className='controls'>
            <div className='close control' onClick={()=>closeFocusMode()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="#C5C5C5" viewBox="0 0 14 16">
                    <path d="M1 2L13 14" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 14L13 2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
            {arrowButtons}
        </div>
    )
}