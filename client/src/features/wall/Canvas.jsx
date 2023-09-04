import OpenSeadragon from 'openseadragon';
import React, { useEffect, useState } from "react";

export default function Canvas({ dzi, canvasClick, onMount }) {

    const [viewer, setViewer] = useState(null);
    
    let dX = 0;
    let dY = 0;
    let press;

    useEffect(()=>{
        if (dzi) {
            initViewer();
        }
        return () => {
            viewer && viewer.destroy();
        }
    }, [dzi]);

    useEffect(()=>{
        onMount(viewer);
    },[viewer])

    const initViewer = () => {
        viewer && viewer.destroy();
        const thisViewer = OpenSeadragon({
            id: 'canvas',
            prefixUrl: "/openseadragon-buttons/",
            tileSources: dzi,
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            showNavigator:  true,
            navigatorPosition:   "BOTTOM_RIGHT",
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            visibilityRatio: 1,
            zoomPerScroll: 2
        })
        setViewer(thisViewer);

        function onCanvasPress(e) {
            press = e.position;
            dX = 0;
            dY = 0;
        }
        function onCanvasRelease(e) {
            if (dX < 2 && dY < 2) {
                const imageCoords = thisViewer.viewport.viewerElementToImageCoordinates(e.position);
                canvasClick(e,imageCoords);
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

    return (
        <div id='canvas'></div>
    )
}