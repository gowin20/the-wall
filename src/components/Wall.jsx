import React from 'react'
import FocusMode from './FocusMode';
import { useEffect, useState } from 'react';
import "../css/main.css"
import { getLayout, getSampleImages } from "../lib/NoteInfo";
import Canvas from './Canvas';

export default function Wall({onMount}) {

    const defaultLayout = getLayout();
    const [layout, setLayout] = useState([defaultLayout]);
    const [image, setImage] = useState()

    const setupViewer = async () => {
        const image = await getSampleImages();
        console.log(image)
        setImage(image)
    }

    useEffect(() => {
        setupViewer()
    }, [])

    let focusOn, currentFocus;

    const onDetailsMount = (focusHooks) => {
        currentFocus = focusHooks[0]
        focusOn = focusHooks[1];
    }

    function noteClicked(e) {

        if (currentFocus != null) return;

        // calculate which note was clicked based on current zoom and extent, look up in layout
        const row = 0;
        const col = 0;

        const note = layout[row][col];
        openNote(note);
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

    function changeLayout(e) {
        setLayout(e.target.value);
    }

    return (
        <div className="wall">
            <FocusMode onMount={onDetailsMount}/>
            <Canvas image={image}/>
        </div>
    )

}