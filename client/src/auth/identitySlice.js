import { createSlice } from "@reduxjs/toolkit";

const identitySlice = createSlice({
    name: 'identity',
    initialState: {
        loading: false,
        userInfo: {},
        userToken: null,
        error: null,
        success: false
    },
    reducers: {},
    extraReducers: {}
})

export default identitySlice.reducer