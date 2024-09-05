import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'

import {store} from './store.ts';

import App, { getLayoutId } from './App';
import ErrorPage from './ErrorPage';
import Login from './auth/Login';
import AdminPanel from './admin/AdminPanel';
import RequireAdmin from './auth/RequireAdmin';
import LayoutGenerator from './admin/layout-generator/LayoutGenerator.jsx';
import FocusMode, {loader as noteLoader} from './wall/focus-mode/FocusMode.jsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        loader:getLayoutId,
        children: [
            {
                path: 'note/:noteId',
                element:<FocusMode />,
                loader:noteLoader
            }
        ]
    },
    {
        path: 'user/:username',
        element: <App />,
        errorElement: <ErrorPage />,
        loader:getLayoutId,
        children: [
            {
                path: 'note/:noteId',
                element:<FocusMode />,
                loader:noteLoader
            }
        ]
    },
    {
        path: 'login',
        element:<Login />
    },
    {
        path:'admin',
        element:<RequireAdmin><AdminPanel/></RequireAdmin>
    },
])

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    )
}