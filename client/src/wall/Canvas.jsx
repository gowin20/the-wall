import OpenSeadragon from 'openseadragon';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setFocusByPosition } from './wallSlice';
import { getZoomableImage } from '../api/wall';

export default function Canvas({ sourceId }) {

    const [viewer, setViewer] = useState(null);
    const currentFocus = useSelector((state) => state.wall.focus);
    const noteImageSize = useSelector((state) => state.wall.layout.noteImageSize);
    const dispatch = useDispatch();

    let dX = 0;
    let dY = 0;
    let press;

    useEffect(()=>{

        async function setupCanvas() {
            const tileSource = await getZoomableImage(sourceId);
            console.log(tileSource);
            initViewer(tileSource);
        }

        if (sourceId) {
            setupCanvas();
        }
        return () => {
            viewer && viewer.destroy();
        }
    }, [sourceId]);

    const initViewer = (tileSource) => {
        viewer && viewer.destroy();
        const thisViewer = OpenSeadragon({
            id: 'wallCanvas',
            prefixUrl: "/openseadragon-buttons/",
            tileSources: tileSource,
            animationTime: 0.5,
            blendTime: 0.1,
            showNavigator:  true,
            navigatorPosition:   "BOTTOM_RIGHT",
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            maxZoomLevel:7,
            visibilityRatio: 1,
            constrainDuringPan: true,
            zoomPerScroll: 2
        })
        setViewer(thisViewer);

        function onCanvasPress(e) {
            press = e.position;
            dX = 0;
            dY = 0;
        }
        function onCanvasRelease(e) {
            console.log(dX,dY)
            if (Math.abs(dX) < 2 && Math.abs(dY) < 2) {
                const imageCoords = thisViewer.viewport.viewerElementToImageCoordinates(e.position);
                canvasClicked(e,imageCoords);
            }
        }
        function onMouseMove(e) {
            dX = e.position.x - press.x;
            dY = e.position.y - press.y;
        }
        function onCanvasClick(e) {
            e.preventDefaultAction = true;
        }
        thisViewer.addHandler('canvas-press', onCanvasPress);
        thisViewer.addHandler('canvas-release', onCanvasRelease);
        thisViewer.addHandler('canvas-drag',onMouseMove);
        thisViewer.addHandler('canvas-click',onCanvasClick);
        
    }

    function canvasClicked(e,imageCoords) {
        e.preventDefaultAction = true;
        
        // determine which note was clicked based on the clicked location
        const clickedRow = Math.floor(imageCoords.y / noteImageSize);
        const clickedCol = Math.floor(imageCoords.x / noteImageSize);

        // Set focus mode when clicked
        dispatch(setFocusByPosition({
            row:clickedRow,
            col:clickedCol
        }));
    }

    function disableKeyboardControls(e) {
        e.preventVerticalPan = true;
        e.preventHorizontalPan = true;
    }
    if (viewer) {
        if (currentFocus.note == null) { // Focus mode is off
            // enable keyboard navigation of canvas
            viewer.removeHandler('canvas-key',disableKeyboardControls);
        }
        else { // Focus mode is on
    
            // disable keyboard navigation of canvas
            viewer.addHandler('canvas-key',disableKeyboardControls);
            
            // Pan to center of focused note
            const horizontalMidpoint = ((currentFocus.position.col*2+1)/2) * noteImageSize;
            const verticalMidpoint = ((currentFocus.position.row*2+1)/2) * noteImageSize;
    
            const noteCenter = viewer.viewport.imageToViewportCoordinates(horizontalMidpoint,verticalMidpoint);
            viewer.viewport.panTo(noteCenter);
        }
    }


    return (
        <div id='wallCanvas'></div>
    )
}