import React, { useEffect,useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { getZoomableImage } from '../../api/wall';
import { imageLoaded } from '../wallSlice';
import { useAppDispatch,useAppSelector } from "../../hooks";
import type { Viewer } from '../Canvas';
import './focusMode.css';

export default function NoteView({tilesId}) {
    let loadingHTML = <div className='loadingNote'><img className='loadingNoteAnimation' src='/loading.gif' alt='High-resolution image loading...'/></div>;
    const html = <div id='noteViewer' className='noteImage'>{loadingHTML}</div>;
    //console.log(`Note DZI: ${tilesId}`)
    if (!tilesId) {
        return html
    };
    const [viewer, setViewer] = useState<Viewer>(null);
    const loading = useAppSelector(state=>state.wall.focus.loading);
    const dispatch = useAppDispatch();

    useEffect(() => {

        async function setupNoteView() {
            const tileSource = await getZoomableImage(tilesId);
            initViewer(tileSource);
        }

        if (tilesId) {
            setupNoteView();
        }

    },[tilesId])

    const initViewer = (tileSource) => {
        viewer && viewer.destroy();
        const thisViewer = OpenSeadragon({
            id:'noteViewer',
            prefixUrl: "/openseadragon-buttons/",
            constrainDuringPan: true,
            visibilityRatio:1,
            minZoomLevel:1,
            tileSources:tileSource
        })
        setViewer(thisViewer);

        // Handle loading behavior
        thisViewer.addHandler('open', () => {
            const image = thisViewer.world.getItemAt(0);
            if (image.getFullyLoaded()) {
                dispatch(imageLoaded());
            }
            else {
                image.addOnceHandler('fully-loaded-change',() => {
                    dispatch(imageLoaded());
                })
            }
        })

    }
    
    if (!loading) {
        loadingHTML = <></>;
    }

    return (
        html
    )
}