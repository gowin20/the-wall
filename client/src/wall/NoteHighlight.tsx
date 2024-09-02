import { useAppSelector } from "../hooks";
import React, { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";


const NoteHighlight = ({viewer}) => {

    const noteImageSize = useAppSelector((state) => state.wall.layout.noteImageSize);
    const zoomLevel = useAppSelector((state)=>state.wall.zoom);
    const focusModeOn = useAppSelector((state)=>state.wall.focus.note);
    const [gridPos, setGridPos] = useState({row:0,col:0});

    useEffect(()=>{
        const wall = document.getElementById('wall');
        if (wall) wall.addEventListener('mousemove',e=>{
            if (!viewer) return;
            const imageCoords = viewer.viewport.windowToImageCoordinates(new OpenSeadragon.Point(e.x,e.y));
            const currentRow = Math.floor(imageCoords.y / noteImageSize);
            const currentCol = Math.floor(imageCoords.x / noteImageSize);

            if (gridPos.col !== currentCol || gridPos.row != currentRow) {
                // Need to set these before calling setGridPos because of some weird reason I don't understand
                gridPos.col = currentCol;
                gridPos.row = currentRow;
                setGridPos({col:gridPos.col,row:gridPos.row});
            }
        })
    },[gridPos, viewer])

    if (!viewer) return <></>;
    if (focusModeOn) return <div id="noteHighlight"/>;
    if (!document.getElementById('noteHighlight')) return <div id="noteHighlight"/>;

    // Position highlight box evenly with note grid
    const topEdge = gridPos.row * noteImageSize;
    const leftEdge = gridPos.col * noteImageSize;

    const leftAdjustment = 8 - zoomLevel;
    const topAdjustment = 8 - zoomLevel;
    const overlayRect = viewer.viewport.imageToViewportRectangle(leftEdge+leftAdjustment,topEdge+topAdjustment,noteImageSize-leftAdjustment,noteImageSize-topAdjustment);

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