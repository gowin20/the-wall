import {SERVER_DOMAIN} from './config.ts';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {RootState} from "./store";

export const siteApi = createApi({
    reducerPath:'api',
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
    endpoints: () => ({}),
})