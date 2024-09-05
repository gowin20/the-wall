import React from 'react';
import Wall from "./wall/Wall";
import Header from "./Header";
import './main.css';
import { useLoaderData } from 'react-router-dom';
import { LayoutId } from './wall/wallTypes';
import { store } from './store';
import { creatorsApi } from './creators/creatorsApi';
import { Username } from './creators/creatorTypes';

/**
 * Loader function that fetches the current layout ID
 * @param params.username - the name of the current user page, if any
 */
interface AppLoaderData {
    layoutId:LayoutId | 'default';
    username:Username | ''
}
export async function getLayoutId({params}) {
    if (!params.username) return {
        layoutId: 'default',
        username: ''
    };
    const {data} = await store.dispatch(creatorsApi.endpoints.getCreatorByUsername.initiate(params.username));
    if (data) return {
        layoutId:data.layout,
        username:params.username
    };
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
    console.log(loaderData)
    if (!loaderData.layoutId) throw new Error(`User ${loaderData.username} not found`)
    return (
        <div className="app">
            <Header />
            <Wall baseUrl={loaderData.username} layoutId={loaderData.layoutId}/>
        </div>
    );
}