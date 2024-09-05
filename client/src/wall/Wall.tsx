import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch,useAppSelector } from "../hooks";
import './wall.css';
import { setLayout } from './wallSlice';
import { useGetDefaultLayoutQuery, useGetLayoutQuery } from './wallApi';
import { LayoutId, LayoutObject } from './wallTypes';
import Canvas from './Canvas';

/**
 * @typeParam baseUrl - URL of the current page, to support focus mode
 * @typeParam layoutId - ID of the current layout. 'default' fetches the default layout, whatever its ID may be.
 */
interface WallProps {
    baseUrl: string;
    layoutId: 'default' | LayoutId;
}

/**
 * Wall component provides an interactive, zoomable view of the current art. Supports the 'default' wall (/) and user walls (/@username)
 * @param props - see interface WallProps
 * @returns HTML containing the FocusMode and Canvas components.
 */
export default function Wall(props : WallProps) {

    const layout = useAppSelector<LayoutObject>((state) => state.wall.layout);
    const focusedNote = useAppSelector((state)=>state.wall.focus.note);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  
    // Fetch default layout
    const {data} = useGetLayoutQuery(props.layoutId);
    useEffect(() => {
        if (data) {
            dispatch(setLayout(data));
        }
    }, [data])

    // Open focus mode when the focused note is updated
    useEffect(()=>{
        if (focusedNote) {
            navigate(`./note/${focusedNote}`)
        }
    },[focusedNote]);

    if (!layout.image) return <></>; // prevent loading canvas without an image

    return (
        <div id="wall" className="with-header-height">
            <Outlet context={focusedNote} />
            <Canvas sourceId={layout.image} />
        </div>
    )
}