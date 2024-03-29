import { createAsyncThunk } from "@reduxjs/toolkit";
import store from "../store";
import { SERVER_URL } from "../api/api";

export const listCreators = createAsyncThunk(
    'listCreators',
    async (_,{rejectWithValue}) => {
        try {
            const response = await fetch(`${SERVER_URL}users/`, {
                method:'GET'
            });
            const data = await response.json();
            return data;
        }
        catch (e) {
            return rejectWithValue(e);
        }
    }
)

export const addCreator = createAsyncThunk(
    'addCreator',
    async ({name}, {rejectWithValue}) => {
        // TODO POST to server to create new "user"
        console.log('Adding creator',name);
        try {
            const token = store.getState().auth.userToken;
            const response = await fetch(`${SERVER_URL}users/create`,{
                method:'POST',
                body:JSON.stringify({
                    name:name
                }),
                headers:{
                    'Authorization':token,
                    'Content-Type':'application/json'
                },
            })
            if (response.status == 401) return rejectWithValue((await response.json()).message);
            return (await response.json()).message;
        }
        catch (e) {
            return rejectWithValue(e);
        }
    }
)