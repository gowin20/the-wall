import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { SERVER_DOMAIN } from '../api/api'
export const authApi = createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:SERVER_DOMAIN,
        prepareHeaders:(headers, {getState})=>{
            const token = getState().auth.userToken;
            if (token) {
                headers.set('authorization',token);
                return headers;
            }
        }
    }),
    endpoints:(builder)=>({
        verifyLogin: builder.query({
            query: ()=> ({
                url:'/users/verifyLogin',
                method:'GET'
            })
        })
    })
})
export const {useVerifyLoginQuery} = authApi;