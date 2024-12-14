import OpenSeadragon from 'openseadragon';
import {useMediaQuery} from 'react-responsive';
import React, { useEffect, useState } from "react";
import { useAppDispatch,useAppSelector } from "../hooks";
import { setFocusByPosition, updateZoom } from './wallSlice';
import type { DziId } from './wallTypes';
import { useGetZoomableImageQuery } from './wallApi';
import NoteHighlight from './NoteHighlight';

export type Viewer = OpenSeadragon.Viewer | null;

interface CanvasProps {
    sourceId: DziId;
}

export default function Canvas({ sourceId } : CanvasProps) {
    
    const dispatch = useAppDispatch();
    const currentFocus = useAppSelector((state) => state.wall.focus);
    const noteImageSize = useAppSelector((state) => state.wall.layout.noteImageSize);
    const [dragging,setDragging] = useState<string>('');
    const [viewer,setViewer] = useState<Viewer>(null)
    const {data, isFetching} = useGetZoomableImageQuery(sourceId);
    const [isMobile, setIsMobile] = useState(false);
    
    let dX = 0;
    let dY = 0;
    let press = new OpenSeadragon.Point();
    
    useEffect(()=>{
        // Load DZI url from server with query hook
        if (data) initViewer(data);
        return () => {
            viewer && viewer.destroy();
        }
    }, [data]);

    const handleResize = () => {
        if (window.innerWidth < 760) {
            console.log('MOBILE')
            setIsMobile(true);
        }
        else {
            console.log('NOT MOBILE')
            setIsMobile(false);
        }
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize',handleResize)
    },[])

    

    const initViewer = (tileSource) => {
        viewer && viewer.destroy();
        const thisViewer = OpenSeadragon({
            id: 'wallCanvas',
            prefixUrl: "/openseadragon-buttons/",
            showFullPageControl:false,
            tileSources: tileSource,
            animationTime: 0.5,
            blendTime: 0.1,
            showNavigator:  !isMobile,
            navigatorPosition:   "BOTTOM_RIGHT",
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            maxZoomLevel:7,
            defaultZoomLevel:2.5,
            visibilityRatio: 1,
            constrainDuringPan: true,
            zoomPerScroll: 2
        })
        setViewer(thisViewer);

        dispatch(updateZoom(thisViewer.viewport.getZoom()));


        // Event handlers for canvas

        thisViewer.addHandler('canvas-press', (e: OpenSeadragon.CanvasPressEvent) => {
            press = e.position;
            dX = 0;
            dY = 0;

        });

        thisViewer.addHandler('canvas-release', (e: OpenSeadragon.CanvasReleaseEvent) => {
            // Remove class from canvas div to reset cursor
            setDragging('');

            // Check if note clicked
            if (Math.abs(dX) < 2 && Math.abs(dY) < 2) {
                const imageCoords = thisViewer.viewport.viewerElementToImageCoordinates(e.position);
                
                // Determine which note was clicked based on the clicked location
                const clickedRow = Math.floor(imageCoords.y / noteImageSize);
                const clickedCol = Math.floor(imageCoords.x / noteImageSize);

                // Set focus mode when clicked
                dispatch(setFocusByPosition({
                    row:clickedRow,
                    col:clickedCol
                }));
            }
        });

        thisViewer.addHandler('canvas-drag',(e: OpenSeadragon.CanvasDragEvent) => {
            // Add class to canvas div to update cursor 
            setDragging('canvasDrag');
            dX = e.position.x - press.x;
            dY = e.position.y - press.y;
        });

        thisViewer.addHandler('canvas-click',(e: OpenSeadragon.CanvasClickEvent) => {
            e.preventDefaultAction = true;
        });

        thisViewer.addHandler('zoom',() => {
            const zoomLevel = thisViewer.viewport.getZoom();
            if (zoomLevel > thisViewer.viewport.getMaxZoom() || zoomLevel < thisViewer.viewport.getMinZoom()) return;
            dispatch(updateZoom(thisViewer.viewport.getZoom()));
        });
        
    }

    const disableKeyboardControls = (e:OpenSeadragon.CanvasKeyEvent) => {
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
        <div id='wallCanvas' className={dragging}><NoteHighlight viewer={viewer}/></div>
    )
}