import OpenSeadragon from 'openseadragon';
import React, { useEffect, useState } from "react";

export default function Canvas(props) {

    //console.log(props.image)
    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        if (props.image && viewer) {
            console.log(props.image);
            viewer.open(props.image.source);
            console.log(viewer)
        }
    }, [props.image])

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