import { useRouteError } from "react-router-dom";
import React from "react";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id='error-page'>
            <i>404 {error.statusText || error.message}</i>
        </div>
    )
}