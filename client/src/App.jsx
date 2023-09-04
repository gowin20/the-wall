import React from 'react';
import Wall from "./wall/Wall";
import Header from "./Header";
import './css/main.css';

export default function App() {
    return (
        <div className="app">
            <Header />
            <Wall/>
        </div>
    );
}