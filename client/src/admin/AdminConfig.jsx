import { setEditMode, logOut } from "../auth/authSlice";
import { useAppDispatch } from "../hooks";
import React from "react";
import './admin.css';

const AdminConfig = () => {
    const dispatch = useAppDispatch();

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
    )
}

export default AdminConfig;