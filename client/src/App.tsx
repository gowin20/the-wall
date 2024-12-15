import React from 'react';
import Wall from "./wall/Wall";
import Header from "./Header";
import './main.css';
import { useLoaderData } from 'react-router-dom';
import { LayoutId } from './wall/wallTypes';
import { store } from './store';
import { creatorsApi } from './creators/creatorsApi';
import { Username } from './creators/creatorTypes';

/* Layout information

*/
interface AppLoaderData {
    layoutId: 'defaultVertical' | 'defaultHorizontal' | LayoutId;
    username: '' | Username;
}

/**
 * Loader function that fetches the current layout ID
 * @param params.username - the name of the current user page, if any
 */
export async function getLayoutId({params}) {
    // Return the default layout
    if (!params.username) {
        return {
            layoutId: window.innerWidth < 760 ? 'defaultVertical' : 'defaultHorizontal',
            username: ''
        };
    }
    // Return a user layout
    const {data} = await store.dispatch(creatorsApi.endpoints.getCreatorByUsername.initiate(params.username));
    if (data) return {
        layoutId:data.layout,
        username:params.username
    };
    // Return no layout (will error)
    else return {
            layoutId:null,
            username:params.username
    };
}

/**
 * Core app component. Initialized to root page by default
 * @returns Primary HTML for application
 * 
 */
export default function App() {
    const loaderData = useLoaderData() as AppLoaderData;
    if (!loaderData.layoutId) throw new Error(`User ${loaderData.username} not found`)
    console.log(loaderData);
    return (
        <div className="app">
            <Header />
            <Wall baseUrl={loaderData.username} layoutId={loaderData.layoutId} />
        </div>
    );
}