import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEditMode, logOut } from "../auth/authSlice";
import './admin.css';
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // run request to check if user is admin, otherwise redirect
    let editEnabled;
    const editStatus = localStorage.getItem('editMode');
    if (editStatus === 'enabled') editEnabled = true;
    else editEnabled = false;
    // verify logged in
    const logout = () => {
        dispatch(logOut());
        navigate('/');
    }

    return (
        <div>
            <p>Welcome, administrator</p>
            <div className='adminPanel'>
                <div className='panel'>
                    <div className="editButton">
                    Edit Mode
                    <label className='switch'>
                        <input type='checkbox' defaultChecked={editEnabled ? editEnabled : undefined} onChange={(e)=>dispatch(setEditMode(e.target.checked))}/>
                        <span className='slider'></span>
                    </label>
                    </div>
                    <div className="logout">
                        <button onClick={e=>logout()}>Log out</button>
                    </div>
                </div>
                <div className='panel'>
                    <div className='adminLink' onClick={e=>navigate('/')}>Home</div>
                    <div className='adminLink' onClick={e=>navigate('/admin/layout-generator')}>Layout generator</div>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel;