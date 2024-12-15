import React, { useState, useEffect } from 'react'
import { useVerifyLoginQuery } from './auth/authApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { logOut, setEditMode } from './auth/authSlice';
import { UserObject } from './creators/creatorTypes';

type UserState = UserObject | null;

export default function Header() {
    const {data, isFetching} = useVerifyLoginQuery(null);
    const [userInfo,setUserInfo] = useState<UserState>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userToken = useAppSelector(state=>state.auth.userToken);
    const editMode = useAppSelector(state=>state.auth.editMode);
    useEffect(()=>{
        if (data && data.isLoggedIn) {
            setUserInfo(data.userInfo);
        }
        else if (!userToken) {
            console.log('Signing you out now okay?',userToken)
            dispatch(logOut())
        }
    }, [data])

    useEffect(()=>{
        if (editMode && !userToken) dispatch(setEditMode(false)); 
    })

    let adminButton = <></>
    if (userInfo && userInfo.isAdmin) {
        adminButton = <div className='adminButton' onClick={e=>navigate('/admin')}>Admin panel</div>
    }

    return (
        <div className="header">
            <div className="header-contents">
                <svg className="square-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" fill="#D9D9D9"/>
                </svg>
                <span className="project-title">The Wall</span>
                {adminButton}
            </div>
        </div>
    )
}