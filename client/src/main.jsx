import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)