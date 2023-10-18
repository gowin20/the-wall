import React, { useEffect } from 'react';
import Canvas from './Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { setLayout } from './wallSlice';
import { getDefaultLayout } from '../api/wall';
import NoteHighlight from './NoteHighlight';
import { Outlet, useNavigate } from 'react-router-dom';
import './wall.css';


export default function Wall() {

    const layout = useSelector((state) => state.wall.layout);
    const focusedNote = useSelector((state)=>state.wall.focus.note);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Fetch layout and image data (TODO create async thunk for this);
    useEffect(() => {
        async function setupLayout() {
            const defaultLayout = await getDefaultLayout();
            dispatch(setLayout(defaultLayout));
        }

        setupLayout().catch(console.error);
    }, [])

    // Open focus mode when the focused note is updated
    useEffect(()=>{
        if (focusedNote) {
            navigate(`/note/${focusedNote}`)
        }
    },focusedNote);
    return (
        <div id="wall" className="with-header-height">
            <Outlet />
            <NoteHighlight />
            <Canvas sourceId={layout.image} />
        </div>
    )

}