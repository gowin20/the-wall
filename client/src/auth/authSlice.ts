import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { logIn } from "./authActions";
import { UserObject } from "../creators/creatorTypes";
import { AuthToken } from "./authTypes";
import { authApi } from "./authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";

console.log();

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

const initialState : AuthState = {
    userInfo: null,
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

            console.log('loggingout',localStorage.getItem('userToken'));
        }
    },
    extraReducers: (builder) => {

        builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
            console.log('spinny thing')
            state.loading = true;
            state.error = null;
        });

        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, {payload}) => {
            console.log('hurray')
            state.loading = false;
            state.userInfo = payload.userInfo;
            state.userToken = payload.token;
            state.success = true;
        });

        builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
            console.log(action.payload)

            state.loading = false;
            state.error = action.payload;
        });
    }
})

export const {setEditMode,setCredentials,logOut} = identitySlice.actions;
export default identitySlice.reducer