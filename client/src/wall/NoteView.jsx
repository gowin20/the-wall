import React, { useEffect,useState } from 'react';
import OpenSeadragon from 'openseadragon';

export default function NoteView({noteUrl}) {

    if (!noteUrl) return <></>;
    const [viewer, setViewer] = useState(null);
    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        initViewer();

        return () => {
            viewer && viewer.destroy();
        }
    },[noteUrl])

    const initViewer = () => {
        viewer && viewer.destroy();
        setLoaded(false);
        const thisViewer = OpenSeadragon({
            id:'noteViewer',
            prefixUrl: "/openseadragon-buttons/",
            constrainDuringPan: true,
            visibilityRatio:1,
            minZoomLevel:1,
            tileSources:{
                type:'image',
                url:noteUrl,
                crossOriginPolicy: 'Anonymous',
                ajaxWithCredentials: false
            }
        })
        setViewer(thisViewer);

        // Handle loading behavior
        thisViewer.addHandler('open', () => {
            const image = thisViewer.world.getItemAt(0);
            if (image.getFullyLoaded()) {
                setLoaded(true);
            }
            else {
                image.addOnceHandler('fully-loaded-change',() => setLoaded(true))
            }
        })

    }
    console.log('loaded? '+loaded);
    let loadingHTML;
    if (!loaded) {
        loadingHTML = <div className='loadingNote'><img className='loadingNoteAnimation' src='loading.gif' alt='High-resolution image loading...'/></div>
    }

    return (
        <div id='noteViewer' className='noteImage'>{loadingHTML}</div>
    )
}