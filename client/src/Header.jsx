import React, { useState, useEffect } from 'react'

export default function Header() {

    const [shown, show] = useState(true);

    /*
    function onHeaderMount(hooks) {
        //headerShown = hooks[0];
        //toggleHeader = hooks[1];
    }
    // hide header and adjust canvas height
    function hideHeader() {
        //toggleHeader(false);
        document.getElementById('wall').classList.remove('with-header-height');
        document.getElementById('wall').classList.add('full-height');
    }

    // show header and adjust canvas height
    function showHeader() {
        //toggleHeader(true);
        document.getElementById('wall').classList.remove('full-height');
        document.getElementById('wall').classList.add('with-header-height');
    }
    */

    if (shown) return (
        <div className="header">
            <div className="header-contents">
                <svg className="square-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" fill="#D9D9D9"/>
                </svg>
                <span className="project-title">The Wall</span>
            </div>
        </div>
    );
    else return <></>;
}