import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store';
import App from './App.jsx';
import ErrorPage from './ErrorPage';
import Login from './auth/Login';
import AdminPanel from './admin/AdminPanel';
import RequireAdmin from './auth/RequireAdmin';
import LayoutGenerator from './admin/LayoutGenerator';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'notes/:id'
            },
            {
                path: '@:id',
                children: [
                    {
                        path: 'notes/:id'
                    }
                ]
            }
        ]
    },
    {
        path: 'login',
        element:<Login />
    },
    {
        path:'admin',
        element:<RequireAdmin><AdminPanel/></RequireAdmin>,
        children: [
            {
                path:'layout-generator',
                element:<RequireAdmin><LayoutGenerator/></RequireAdmin>
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
)