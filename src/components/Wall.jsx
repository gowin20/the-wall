import React from 'react'
import { useEffect, useState } from 'react';
import { getLayout } from "../middleware/util";
import Header from "./Header"
import FocusMode from './FocusMode';
import Canvas from './Canvas';

export default function Wall() {
    let setFocusMode, currentFocus, toggleHeader, headerShown, viewer;

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
    const onCanvasMount = (viewerHook) => {
        viewer = viewerHook;
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

    function disableKeyboardControls(e) {
        e.preventVerticalPan = true;
        e.preventHorizontalPan = true;
    }

    function setFocusFromCoords(row,col) {
        // validate inputs
        console.log(row,col,layout.props)

        if (row >= layout.props.HEIGHT || row < 0) return;
        if (col >= layout.props.WIDTH || col < 0) return;

        // collapse header
        //hideHeader();

        // Open focus mode
        setFocusMode({
            url: layout.array[row][col],
            location: [row,col],
            buttons: {
                up:(row > 0),
                down:(row < layout.props.HEIGHT-1),
                left:(col > 0),
                right:(col < layout.props.WIDTH-1)
            }
        });

        // disable keyboard navigation on wall
        viewer.addHandler('canvas-key',disableKeyboardControls);
        
        // pan to the center of the clicked note
        const horizontalMidpoint = ((col*2+1)/2) * layout.props.NOTE_SIZE;
        const verticalMidpoint = ((row*2+1)/2) * layout.props.NOTE_SIZE;

        const noteCenter = viewer.viewport.imageToViewportCoordinates(horizontalMidpoint,verticalMidpoint);
        viewer.viewport.panTo(noteCenter);
    }

    function clearFocus() {
        if (currentFocus.url !== null) {
            setFocusMode({
                url:null,
                location:null,
                buttons:null
            });
            //showHeader();

            // re-enable keyboard navigation
            viewer.removeHandler('canvas-key',disableKeyboardControls);
        }
    }

    return (
        <>
        <Header onMount={onHeaderMount}/>
        <div id="wall" className="with-header-height">
            <FocusMode onMount={onFocusMount} clearNote={clearFocus} changeNote={setFocusFromCoords}/>
            <Canvas onMount={onCanvasMount} image={layout.image} canvasClick={canvasClicked} />
        </div>
        </>
    )

}