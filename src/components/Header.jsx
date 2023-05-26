import "../css/main.css";
import React from 'react'

export default function Header() {
    return (
        <div className="header">
            <div className="header-contents">
                <svg className="square-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" fill="#D9D9D9"/>
                </svg>
                <span className="project-title">The Wall</span>
            </div>
        </div>
    );
}