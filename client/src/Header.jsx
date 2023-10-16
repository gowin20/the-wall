import React, { useState, useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useVerifyLoginQuery } from './auth/authApi';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const {data, isFetching} = useVerifyLoginQuery();
    const [userInfo,setUserInfo] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        console.log(data)
        if (data && data.isLoggedIn) setUserInfo(data.userInfo);
    }, [data])

    if (userInfo) console.log('Info',userInfo);

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