import React from 'react'
import { useEffect, useState } from 'react';

import "../css/main.css"
import { getLayout } from "../middleware/util";
import Header from "./Header"
import FocusMode from './FocusMode';
import Canvas from './Canvas';

export default function Wall() {
    let setFocusMode, currentFocus, toggleHeader, headerShown;

    const [layout, setLayout] = useState({
        image:null
    });

    const NOTE_SIZE = 2884;

    async function setupLayout(name) {
        const layout = await getLayout(name);
        setLayout(layout);
    }

    useEffect(() => {
        setupLayout('default');
    }, [])

    function onHeaderMount(hooks) {
        headerShown = hooks[0];
        toggleHeader = hooks[1];
    }
    const onFocusMount = (focusHooks) => {
        currentFocus = focusHooks[0];
        setFocusMode = focusHooks[1];
    }

    function canvasClicked(e,imageCoords) {
        e.preventDefaultAction = true;
        
        // collapse header
        hideHeader();

        // determine which note was clicked based on the clicked location
        const row = Math.floor(imageCoords.y / NOTE_SIZE);
        const col = Math.floor(imageCoords.x / NOTE_SIZE);

        const noteUrl = layout.array[row][col];
        // Open focus mode
        setFocusMode(noteUrl);

        // TODO
        // get the center of the note
        // fly to a preset zoom and location in the layout
    }

    function hideHeader() {
        toggleHeader(false);
        document.getElementById('wall').classList.remove('with-header-height');
        document.getElementById('wall').classList.add('full-height');
    }

    function showHeader() {
        toggleHeader(true);
        document.getElementById('wall').classList.remove('full-height');
        document.getElementById('wall').classList.add('with-header-height');
    }

    function clearFocus() {
        if (currentFocus !== null) {
            console.log('current focus: ', currentFocus)
            setFocusMode(null);
            showHeader();
        }
    }

    return (
        <>
        <Header onMount={onHeaderMount}/>
        <div id="wall" className="with-header-height">
            <FocusMode onMount={onFocusMount} clearFocus={clearFocus}/>
            <Canvas image={layout.image} canvasClick={canvasClicked} />
        </div>
        </>
    )

}