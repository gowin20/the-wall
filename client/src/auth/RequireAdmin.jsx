import React, {useEffect} from "react"
import { useAppDispatch,useAppSelector } from "../hooks";
import { setCredentials } from "./authSlice";
import { useVerifyLoginQuery } from "./authApi";
import { useNavigate } from "react-router-dom";
const RequireAdmin = ({children}) => {
    
    // Check if user is logged in
    const {data, isFetching} = useVerifyLoginQuery();
    const dispatch = useAppDispatch();
    useEffect(()=>{
        console.log(data)
        if (data && data.isLoggedIn) dispatch(setCredentials(data.userInfo));
    }, [data])

    const navigate = useNavigate();
    const userIsAdmin = useAppSelector((state)=>state.auth.userInfo.isAdmin);

    // Check if user is admin
    useEffect(()=>{
        if (!userIsAdmin) {
            navigate('/login')
            return;
        }
    },[userIsAdmin])
    
    return children;
}
export default RequireAdmin;