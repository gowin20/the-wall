import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {RootState} from "../store";
import {SERVER_DOMAIN} from '../config.ts';
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

export const authApi = createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:SERVER_DOMAIN,
        prepareHeaders:(headers, {getState})=>{
            const state = getState() as RootState;
            const token = state.auth.userToken;
            if (token) {
                headers.set('Authorization',token);
                return headers;
            }
        }
    }),
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
    })
})
export const {useVerifyLoginQuery, useLazyVerifyLoginQuery, useLazyLoginQuery} = authApi;