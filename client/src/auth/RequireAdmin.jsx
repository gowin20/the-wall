import React, {useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useVerifyLoginQuery } from "./authApi";
import { useNavigate } from "react-router-dom";
const RequireAdmin = ({children}) => {
    
    const {data, isFetching} = useVerifyLoginQuery();
    const dispatch = useDispatch();
    useEffect(()=>{
        console.log(data)
        if (data && data.isLoggedIn) dispatch(setCredentials(data.userInfo));
    }, [data])

    const navigate = useNavigate();
    const userIsAdmin = useSelector((state)=>state.auth.userInfo.isAdmin);
    //const userIsLogged = useLoginStatus(); // Your hook to get login status

    useEffect(()=>{
        if (!userIsAdmin) {
            navigate('/login')
            return;
        }
    },[userIsAdmin])
    
    return children;
}
export default RequireAdmin;