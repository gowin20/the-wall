import { createSlice } from "@reduxjs/toolkit";
import { logIn } from "./authActions";
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;
const editMode = (localStorage.getItem('editMode') === 'enabled') ? true : false;

const identitySlice = createSlice({
    name: 'identity',
    initialState: {
        userInfo: {},
        userToken,
        editMode,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        setEditMode: (state, action) => {
            //if (!state.userInfo) throw new Error('you shouldn\'t be here');

            state.editMode = action.payload;
            console.log(state.editMode);
            if (state.editMode) localStorage.setItem('editMode','enabled');
            else localStorage.setItem('editMode','disabled');
        },
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
        },
        logOut: (state) => {
            state.userInfo = {}

            localStorage.removeItem('editMode');
            localStorage.removeItem('userToken');
        }
    },
    extraReducers: {
        [logIn.pending]: (state) => {
            console.log('spinny thing')
            state.loading = true;
            state.error = null;
        },
        [logIn.fulfilled]: (state, {payload}) => {
            console.log('hurray')
            state.loading = false;
            state.userInfo = payload.userInfo;
            state.userToken = payload.token;
            state.success = true;
        },
        [logIn.rejected]: (state, {payload}) => {
            console.log(payload)
            state.loading = false;
            state.error = payload;
        }
    }
})

export const {setEditMode,setCredentials} = identitySlice.actions;
export default identitySlice.reducer