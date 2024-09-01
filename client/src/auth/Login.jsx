import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from "../hooks";
import { logIn } from './authActions';
import { useNavigate } from 'react-router-dom';
import { useVerifyLoginQuery } from './authApi';
import { setCredentials } from './authSlice';
import { useLazyLoginQuery } from './authApi';

const Login = () => {
    const userInfo = useAppSelector((state)=>state.auth.userInfo);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [loginTrigger, result, lastPromiseInfo] = useLazyLoginQuery();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userInfo = {
            username:e.target[0].value,
            password:e.target[1].value
        };
        loginTrigger(userInfo);
    }

    const {data, isFetching} = useVerifyLoginQuery('', {pollingInterval:900000});
    useEffect(()=>{
        if (data && data.isLoggedIn) {
            dispatch(setCredentials(data.userInfo));
            navigate('/admin')
        }
    }, [data])

    useEffect(()=>{
        if (userInfo && userInfo.username) navigate('/');
    },[userInfo])

    return (
        <form onSubmit={handleLogin}>
            <span className='formHeader'>Username:</span><input required type="text"/><br/>
            <span className='formheader'>Password:</span><input required type="password"/><br/>
            <input type='submit' value='Log in'/>
        </form>
    )
}
export default Login;