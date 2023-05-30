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

    // hide header and adjust canvas height
    function hideHeader() {
        toggleHeader(false);
        document.getElementById('wall').classList.remove('with-header-height');
        document.getElementById('wall').classList.add('full-height');
    }

    // show header and adjust canvas height
    function showHeader() {
        toggleHeader(true);
        document.getElementById('wall').classList.remove('full-height');
        document.getElementById('wall').classList.add('with-header-height');
    }

    function canvasClicked(e,imageCoords) {
        e.preventDefaultAction = true;
        
        // determine which note was clicked based on the clicked location
        const row = Math.floor(imageCoords.y / layout.props.NOTE_SIZE);
        const col = Math.floor(imageCoords.x / layout.props.NOTE_SIZE);

        setFocusFromCoords(row,col);
    }

    function setFocusFromCoords(row,col) {
        // collapse header
        //hideHeader();

        const noteUrl = layout.array[row][col];
        // Open focus mode
        setFocusMode({
            url:noteUrl,
            location:[row,col],
            buttons:{
                up:(row > 0),
                down:(row < layout.props.HEIGHT-1),
                left:(col > 0),
                right:(col < layout.props.WIDTH-1)
            }
        });

        // TODO
        // get the center of the note
        // fly to a preset zoom and location in the layout
    }

    function clearFocus() {
        if (currentFocus.url !== null) {
            console.log('current focus: ', currentFocus)
            setFocusMode({
                url:null,
                location:null,
                buttons:null
            });
            //showHeader();
        }
    }

    return (
        <>
        <Header onMount={onHeaderMount}/>
        <div id="wall" className="with-header-height">
            <FocusMode onMount={onFocusMount} clearNote={clearFocus} changeNote={setFocusFromCoords}/>
            <Canvas image={layout.image} canvasClick={canvasClicked} />
        </div>
        </>
    )

}