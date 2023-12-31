import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { SERVER_URL } from '../api/api'
export const authApi = createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:SERVER_URL,
        prepareHeaders:(headers, {getState})=>{
            const token = getState().auth.userToken;
            if (token) {
                headers.set('Authorization',token);
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