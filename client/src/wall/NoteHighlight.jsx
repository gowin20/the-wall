import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";


const NoteHighlight = ({viewer}) => {

    if (!viewer) return;

    const noteImageSize = useSelector((state) => state.wall.layout.noteImageSize);
    const zoomLevel = useSelector((state)=>state.wall.zoom);
    const [gridPos, setGridPos] = useState({row:0,col:0})

    useEffect(()=>{
        window.addEventListener('mousemove',(e=>{
            //TODO check that we're inside of the viewer
            const imageCoords = viewer.viewport.windowToImageCoordinates(new OpenSeadragon.Point(e.x,e.y));
            //console.log(imageCoords,noteImageSize);
            const currentRow = Math.floor(imageCoords.y / noteImageSize);
            const currentCol = Math.floor(imageCoords.x / noteImageSize);

            if (gridPos.col !== currentCol || gridPos.row != currentRow) {
                gridPos.col = currentCol;
                gridPos.row = currentRow;
                setGridPos({col:gridPos.col,row:gridPos.row});
            }
        }))
    },[gridPos])

    if (!document.getElementById('noteHighlight')) return <div id="noteHighlight"/>;

    // when row and col changes
    // TODO find the top left corner instead
    const topEdge = gridPos.row * noteImageSize;
    const leftEdge = gridPos.col * noteImageSize;

    // TODO subscribe to zoom level and change these values dynamically
    const adjustment = 10 - zoomLevel;
    console.log(adjustment);
    const overlayRect = viewer.viewport.imageToViewportRectangle(leftEdge+adjustment,topEdge,noteImageSize-adjustment,noteImageSize);

    viewer.clearOverlays();
    viewer.addOverlay({
        element:"noteHighlight",
        location:overlayRect
    })

    const style = {
        boxShadow:`0px 0px ${1+zoomLevel}px ${zoomLevel/4}px #303030`
    }

    return <div id="noteHighlight" style={style}/>
}

export default NoteHighlight;