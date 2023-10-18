import React, { useEffect,useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { getZoomableImage } from '../../api/wall';
import { imageLoaded } from '../wallSlice';
import { useDispatch } from 'react-redux';

export default function NoteView({tilesId}) {
    //console.log(`Note DZI: ${tilesId}`)
    if (!tilesId) {
        //throw new Error('No tiles available for selected note.')
        return <></>
    };
    const [viewer, setViewer] = useState(null);
    const [loaded,setLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {

        async function setupNoteView() {
            const tileSource = await getZoomableImage(tilesId);
            initViewer(tileSource);
        }

        if (tilesId) {
            setupNoteView();
        }

        return () => {
            viewer && viewer.destroy();
        }
    },[tilesId])

    const initViewer = (tileSource) => {
        viewer && viewer.destroy();
        setLoaded(false);
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
                setLoaded(true);
                dispatch(imageLoaded());
            }
            else {
                // TODO disable keyboard arrow keys until image is fully loaded
                image.addOnceHandler('fully-loaded-change',() => {
                    setLoaded(true);
                    dispatch(imageLoaded());
                })
            }
        })

    }
    
    let loadingHTML;
    if (!loaded) {
        loadingHTML = <div className='loadingNote'><img className='loadingNoteAnimation' src='/loading.gif' alt='High-resolution image loading...'/></div>
    }

    return (
        <div id='noteViewer' className='noteImage'>{loadingHTML}</div>
    )
}