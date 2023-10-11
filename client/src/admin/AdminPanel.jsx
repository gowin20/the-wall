import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEditMode } from "../auth/authSlice";
import './admin.css';

const AdminPanel = () => {
    const dispatch = useDispatch();
    // run request to check if user is admin, otherwise redirect
    let editEnabled;
    const editStatus = localStorage.getItem('editMode');
    if (editStatus === 'enabled') editEnabled = true;
    else editEnabled = false;
    // verify logged in


    return (
        <div>
            <p>Welcome, administrator</p>
            <div className='adminPanel'>
                <div className='panel'>
                    Edit Mode
                    <label className='switch'>
                        <input type='checkbox' defaultChecked={editEnabled ? editEnabled : undefined} onChange={(e)=>dispatch(setEditMode(e.target.checked))}/>
                        <span className='slider'></span>
                    </label>
                </div>
                <div className='panel'>
                    <a href=''>Layout generator</a>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel;