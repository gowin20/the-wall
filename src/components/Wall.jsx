import React from 'react'
import { useEffect, useState } from 'react';

import "../css/main.css"
import { getLayout } from "../middleware/util";
import Header from "./Header"
import FocusMode from './FocusMode';
import Canvas from './Canvas';

export default function Wall() {
    let viewer, setFocusMode, currentFocus, toggleHeader, headerShown;

    const [array, setArray] = useState();
    const [image, setImage] = useState();

    async function setLayout(name) {
        const layout = await getLayout(name);
        setImage(layout.image);
        setArray(layout.array);
    }

    useEffect(() => {
        setLayout('default')
    }, [])

    function onHeaderMount(hooks) {
        headerShown = hooks[0];
        toggleHeader = hooks[1];
    }
    const onFocusMount = (focusHooks) => {
        currentFocus = focusHooks[0];
        setFocusMode = focusHooks[1];
    }
    const onCanvasMount = (canvasHook) => {
        viewer = canvasHook;
    }

    function canvasClicked(e) {
        e.preventDefaultAction = true;
        console.log('current focus: ',currentFocus);
        noteClicked(e);
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

    function noteClicked(e) {

        
        // collapse header
        hideHeader();

        

        // calculate which note was clicked based on current zoom and extent, look up in layout
        //const note = layout[row][col];
        //openNote(note);

        // get the center of the note

        // fly to a preset zoom and location in the layout
        setFocusMode(e);
        // open focus mode for a note
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
            <Canvas image={image} canvasClick={canvasClicked} onMount={onCanvasMount}/>
        </div>
        </>
    )

}