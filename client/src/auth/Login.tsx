import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from "../hooks";
import { useNavigate } from 'react-router-dom';
import { useVerifyLoginQuery,useLoginMutation } from './authApi';
import { setCredentials } from './authSlice';

const Login = () => {
    const userToken = useAppSelector((state)=>state.auth.userToken);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Check if already logged in
    const {data, isLoading} = useVerifyLoginQuery(null, {pollingInterval:900000})
    useEffect(()=>{
        if (data && data.isLoggedIn) {
            console.log('boop',data)
            dispatch(setCredentials(data.userInfo));
            navigate('/')
        }
    }, [data])

    useEffect(()=>{
        if (userToken) {
            navigate('/')
        }
    },[userToken])

    // API hook to handle login on form submit
    const [loginTrigger, result] = useLoginMutation();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userInfo = {
            username:e.target[0].value,
            password:e.target[1].value
        };
        loginTrigger(userInfo);
    }

    return (
        <form onSubmit={handleLogin}>
            <span className='formHeader'>Username:</span><input required type="text"/><br/>
            <span className='formheader'>Password:</span><input required type="password"/><br/>
            <input type='submit' value='Log in'/>
        </form>
    )
}
export default Login;