import React from 'react'
import { useEffect, useState } from 'react';
import { getLayout } from "../middleware/util";
import FocusMode from './FocusMode';
import Canvas from './Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { setLayout } from './wallSlice';

export default function Wall() {

    const layout = useSelector((state) => state.wall.layout);
    const dispatch = useDispatch();
    
    //const [layout, setLayout] = useState({
    //    image:null
    //});

    useEffect(() => {
        async function setupLayout(name) {
            const defaultLayout = await getLayout(name);
            dispatch(setLayout(defaultLayout));
        }

        setupLayout('default').catch(console.error);
    }, [])

    return (
        <div id="wall" className="with-header-height">
            <FocusMode />
            <Canvas dzi={layout.image} />
        </div>
    )

}