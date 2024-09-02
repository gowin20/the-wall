import React, {useEffect} from "react"
import { useAppDispatch,useAppSelector } from "../hooks";
import { setCredentials } from "./authSlice";
import { useVerifyLoginQuery } from "./authApi";
import { useNavigate } from "react-router-dom";
const RequireAdmin = ({children}) => {
    
    // Check if user is logged in
    const {data, isFetching} = useVerifyLoginQuery(null);
    const dispatch = useAppDispatch();
    useEffect(()=>{
        if (data && data.isLoggedIn) dispatch(setCredentials(data.userInfo));
    }, [data])

    const navigate = useNavigate();
    const userInfo = useAppSelector((state)=>state.auth.userInfo);

    // Check if user is admin
    useEffect(()=>{
        if (isFetching) return;
        if ((data && !data.isLoggedIn) || !userInfo) {
            // User is not signed in
            console.log('You are not signed in!');
            navigate('/login')
            return;
        }
        if (!userInfo.isAdmin) {
            console.log('You are not an admin!',userInfo)
            navigate('/login')
            return;
        }
    },[userInfo,isFetching])
    
    return children;
}
export default RequireAdmin;