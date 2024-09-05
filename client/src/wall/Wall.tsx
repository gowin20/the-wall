import React, { useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useAppDispatch,useAppSelector } from "../hooks";
import './wall.css';
import { setLayout } from './wallSlice';
import { useGetDefaultLayoutQuery } from './wallApi';
import { LayoutObject, NoteId } from './wallTypes';
import Canvas from './Canvas';

export default function Wall() {

    const layout = useAppSelector<LayoutObject>((state) => state.wall.layout);
    const focusedNote = useAppSelector((state)=>state.wall.focus.note);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  
    // Fetch default layout
    const {data, isFetching} = useGetDefaultLayoutQuery(null);
    useEffect(() => {
        if (data) {
            dispatch(setLayout(data));
        }
    }, [data])

    // Open focus mode when the focused note is updated
    useEffect(()=>{
        if (focusedNote) {
            navigate(`/note/${focusedNote}`)
        }
    },[focusedNote]);
    return (
        <div id="wall" className="with-header-height">
            <Outlet context={focusedNote} />
            <Canvas sourceId={layout.image} />
        </div>
    )
}

export const useNoteId = () => {
    return useOutletContext<NoteId>();
}