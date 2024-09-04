import { createSlice } from "@reduxjs/toolkit";
import { UserObject } from "../creators/creatorTypes";
import { AuthToken } from "./authTypes";
import { authApi } from "./authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";

export interface AuthState {
    userInfo: UserObject | null;
    userToken: AuthToken;
    editMode: boolean;
    loading: boolean;
    success: boolean;
    error: string | null | undefined | FetchBaseQueryError;
}

// Load properties from local storage
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : undefined;
let editMode = (localStorage.getItem('editMode') === 'enabled') ? true : false;

const userInfoPresent = localStorage.getItem('userInfo');
const userInfo = userInfoPresent ? JSON.parse(userInfoPresent) : null;

const initialState : AuthState = {
    userInfo,
    userToken,
    editMode,
    loading: false,
    error: null,
    success: false
}

if (editMode && !userToken) {
    localStorage.removeItem('editMode');
    editMode = false;
}

const identitySlice = createSlice({
    name: 'identity',
    initialState,
    reducers: {
        setEditMode: (state, action) => {
            //if (!state.userInfo) throw new Error('you shouldn\'t be here');

            state.editMode = action.payload;
            console.log(state.editMode);
            if (state.editMode) localStorage.setItem('editMode','enabled');
            else localStorage.setItem('editMode','disabled');
        },
        setCredentials: (state, action) => {
            console.log('setCredentials called',action.payload)
            state.userInfo = action.payload;
        },
        logOut: (state) => {
            state.userInfo = null;
            state.userToken = undefined;

            localStorage.removeItem('editMode');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
        }
    },
    extraReducers: (builder) => {

        builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
            console.log('spinny thing')
            state.loading = true;
            state.error = null;
        });

        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, {payload}) => {
            if (payload.token) {
                console.log('hurray')
                state.loading = false;
                state.success = true;
                state.userInfo = payload.userInfo;
                state.userToken = payload.token;
                localStorage.setItem('userToken',payload.token);
                localStorage.setItem('userInfo',JSON.stringify(payload.userInfo));
            }
        });

        builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
            console.log('epic fail',action.payload)

            state.loading = false;
            state.error = action.payload;
        });
    }
})

export const {setEditMode,setCredentials,logOut} = identitySlice.actions;
export default identitySlice.reducer