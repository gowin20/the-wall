import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from './authActions';
import { useNavigate } from 'react-router-dom';
import { useVerifyLoginQuery } from './authApi';
import { setCredentials } from './authSlice';

const Login = () => {
    const {loading, userInfo, error, success} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userInfo = {
            username:e.target[0].value,
            password:e.target[1].value
        };
        dispatch(logIn(userInfo));
    }

    const {data, isFetching} = useVerifyLoginQuery('', {pollingInterval:900000});
    useEffect(()=>{
        if (data && data.isLoggedIn) {
            dispatch(setCredentials(data.userInfo));
            navigate('/admin')
        }
    }, [data])

    useEffect(()=>{
        if (userInfo.isAdmin) navigate('/admin');
        else if (userInfo.username) navigate('/');
    },[userInfo.username])

    return (
        <form onSubmit={handleLogin}>
            <span className='formHeader'>Username:</span><input required type="text"/><br/>
            <span className='formheader'>Password:</span><input required type="password"/><br/>
            <input type='submit' value='Log in'/>
        </form>
    )
}
export default Login;