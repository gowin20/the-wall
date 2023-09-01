import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Wall from "./components/Wall"
import './css/main.css';


export default function App() {
    return (
        <div className="app">
            <Wall/>
        </div>
    );
}