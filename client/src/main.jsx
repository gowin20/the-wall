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
import FocusMode, {loader as noteLoader} from './wall/focus-mode/FocusMode';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'note/:noteId',
                element:<FocusMode />,
                loader:noteLoader
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