import OpenSeadragon from 'openseadragon';
import React, { useEffect, useState } from "react";

export default function Canvas({ image }) {

    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        if (image && viewer) {
            console.log(image.dzi)
            viewer.open(image.dzi);
            console.log(viewer)
        }
    }, [viewer, image])

    const initViewer = () => {
        viewer && viewer.destroy();

        setViewer(
            OpenSeadragon({
                id: 'canvas',
                prefixUrl: "openseadragon-images/",
                animationTime: 0.5,
                blendTime: 0.1,
                constrainDuringPan: true,
                maxZoomPixelRatio: 2,
                minZoomLevel: 1,
                visibilityRatio: 1,
                zoomPerScroll: 2
            })
        )
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