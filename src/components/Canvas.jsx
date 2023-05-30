import OpenSeadragon from 'openseadragon';
import React, { useEffect, useState } from "react";

export default function Canvas({ image, canvasClick, onMount }) {

    const [viewer, setViewer] = useState(null);
    
    if (viewer) console.log(viewer);

    let dX = 0;
    let dY = 0;
    let press;
    useEffect(() => {
        if (image && viewer) {
            viewer.open(image.dzi);
        }
        onMount(viewer);
    }, [viewer, image])

    function onCanvasPress(e) {
        press = e.position;
        dX = 0;
        dY = 0;
    }
    function onCanvasRelease(e) {
        if (dX < 2 && dY < 2) {
            console.log('click happening')
            canvasClick(e);
        }
    }
    function onMouseMove(e) {
        dX = e.position.x - press.x;
        dY = e.position.y - press.y;
    }
    function onCanvasClick(e) {
        e.preventDefaultAction = true;
    }

    const initViewer = () => {
        viewer && viewer.destroy();
        const thisViewer = OpenSeadragon({
            id: 'canvas',
            prefixUrl: "openseadragon-images/",
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
        thisViewer.addHandler('canvas-press', onCanvasPress);
        thisViewer.addHandler('canvas-release', onCanvasRelease);
        thisViewer.addHandler('canvas-drag',onMouseMove);
        thisViewer.addHandler('canvas-click',onCanvasClick);
        setViewer(thisViewer);
    }

    useEffect(()=>{
        initViewer();
        return () => {
            viewer && viewer.destroy();
        }
    }, []);

    return (
        <div id='canvas'></div>
    )
}