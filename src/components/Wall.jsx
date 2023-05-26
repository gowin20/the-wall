import React from 'react'
import FocusMode from './FocusMode';
import { useEffect, useState } from 'react';
import "../css/main.css"
import { getLayout } from "../middleware/util";
import Canvas from './Canvas';

export default function Wall() {

    const [array, setArray] = useState();
    const [image, setImage] = useState()


    async function setLayout(name) {
        const layout = await getLayout(name);

        console.log(layout);
        setImage(layout.image);
        setArray(layout.array);
    }

    function changeLayout(e) {
        setLayout(e.target.value);
    }

    useEffect(() => {
        setLayout('default')
    }, [])

    let focusOn, currentFocus;

    const onFocusMount = (focusHooks) => {
        currentFocus = focusHooks[0]
        focusOn = focusHooks[1];
    }

    function noteClicked(e) {

        if (currentFocus != null) return;

        // calculate which note was clicked based on current zoom and extent, look up in layout
        console.log(array);

        //const note = layout[row][col];
        //openNote(note);
    }

    function clearFocus() {
        if (currentFocus !== null) {
            focusOn(null);
        }
    }

    function openNote(note) {
        // Note is a note json object from the layout
        clearFocus();
        focusOn(note);
    }

    return (
        <div className="wall">
            <FocusMode onMount={onFocusMount}/>
            <Canvas image={image}/>
        </div>
    )

}