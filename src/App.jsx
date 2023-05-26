import React from 'react'
import Header from "./components/Header"
import Wall from "./components/Wall"
import { getLayout } from "./lib/NoteInfo";

export default function App() {
    let currentLayout, setLayout;
    const onWallMount = (wallHooks) => {
        currentLayout = wallHooks[0];
        setLayout = wallHooks[1];
    }

    return (
        <div className="app">
            <Header setLayout={setLayout}/>
            <Wall onMount={onWallMount}/>
        </div>
    );
}