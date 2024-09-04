import { siteApi } from '../api';
import { UserObject } from '../creators/creatorTypes';
import { AuthToken } from './authTypes';

export interface VerifyLoginResponse {
    message: string | null;
    isLoggedIn: boolean;
    userInfo: UserObject | null;
}

export interface LoginResponse {
    message: string | null;
    isLoggedIn: boolean;
    userInfo: UserObject | null;
    token: AuthToken | null;
}

export interface LoginParams {
    username:string;
    password:string;
}

export const authApi = siteApi.injectEndpoints({
    endpoints:(builder)=>({
        verifyLogin: builder.query<VerifyLoginResponse, null>({
            query: ()=> ({
                url:'/users/verifyLogin',
                method:'GET'
            })
        }),

        login: builder.query<LoginResponse, LoginParams>({
            query: (credentials) => ({
                url:'/users/login',
                method:'POST',
                body: credentials
            })
        })
    }),
    overrideExisting:false,
})
export const {useVerifyLoginQuery, useLazyVerifyLoginQuery, useLazyLoginQuery} = authApi;