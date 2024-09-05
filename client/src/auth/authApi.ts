import { siteApi } from '../api';
import { VerifyLoginResponse,LoginResponse,LoginParams } from './authTypes';

export const authApi = siteApi.injectEndpoints({
    endpoints:(builder)=>({
        verifyLogin: builder.query<VerifyLoginResponse, null>({
            query: ()=> ({
                url:'/users/verifyLogin',
                method:'GET'
            })
        }),

        login: builder.mutation<LoginResponse, LoginParams>({
            query: (credentials) => ({
                url:'/users/login',
                method:'POST',
                body: credentials
            })
        })
    }),
    overrideExisting:false,
})
export const {useVerifyLoginQuery, useLazyVerifyLoginQuery, useLoginMutation} = authApi;