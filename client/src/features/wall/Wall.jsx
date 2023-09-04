import React from 'react'
import { useEffect, useState } from 'react';
import { getLayout } from "../../middleware/util";
import Header from "./Header"
import FocusMode from '../focus-mode/FocusMode';
import Canvas from './Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { setLayout } from './wallSlice';

export default function Wall() {
    let setFocusMode, currentFocus, toggleHeader, headerShown, viewer;

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
        const clickedRow = Math.floor(imageCoords.y / layout.noteImageSize);
        const clickedCol = Math.floor(imageCoords.x / layout.noteImageSize);

        setFocusFromCoords(clickedRow,clickedCol);
    }

    function disableKeyboardControls(e) {
        e.preventVerticalPan = true;
        e.preventHorizontalPan = true;
    }

    function setFocusFromCoords(row,col) {
        // validate inputs
        console.log(row,col,layout)

        if (row >= layout.numRows || row < 0) return;
        if (col >= layout.numCols || col < 0) return;

        // collapse header
        //hideHeader();

        // Open focus mode
        setFocusMode({
            id: layout.array[row][col],
            location: [row,col],
            buttons: {
                up:(row > 0),
                down:(row < layout.numRows-1),
                left:(col > 0),
                right:(col < layout.numCols-1)
            }
        });

        // disable keyboard navigation on wall
        viewer.addHandler('canvas-key',disableKeyboardControls);
        
        // pan to the center of the clicked note
        const horizontalMidpoint = ((col*2+1)/2) * layout.noteImageSize;
        const verticalMidpoint = ((row*2+1)/2) * layout.noteImageSize;

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
            <Canvas onMount={onCanvasMount} dzi={layout.image} canvasClick={canvasClicked} />
        </div>
        </>
    )

}