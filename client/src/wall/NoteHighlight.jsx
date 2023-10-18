import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";



const NoteHighlight = ({viewer}) => {

    if (!viewer) return;

    const noteImageSize = useSelector((state) => state.wall.layout.noteImageSize);
    const [gridPos, setGridPos] = useState({row:0,col:0,noteChanged:false})
    const positionAndSize = {
        top:'40%',
        left:'40%',
        width:'50px',
        height:'50px'
    }

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
                //gridPos.noteChanged = true;
                setGridPos({col:gridPos.col,row:gridPos.row,noteChanged:true});
            }
        }))
    },[gridPos])

    if (gridPos.noteChanged) {
        
        // when row and col changes
        // TODO find the top left corner instead
        const leftEdge = gridPos.row * noteImageSize;
        const topEdge = gridPos.col * noteImageSize;

        // TODO subscribe to zoom level and change these values dynamically
        const adjustment = 2;
        const overlayRect = viewer.viewport.imageToViewportRectangle(topEdge+adjustment,leftEdge+adjustment,noteImageSize-adjustment,noteImageSize-adjustment);

        viewer.clearOverlays();
        viewer.addOverlay({
            element:"noteHighlight",
            location:overlayRect
        })

        setGridPos({row:gridPos.row,col:gridPos.col,noteChanged:false});
    }

    return <div id="noteHighlight"/>
}

export default NoteHighlight;