import { createAsyncThunk } from "@reduxjs/toolkit";
const backendURL = 'http://localhost:5050/';

export const listCreators = createAsyncThunk(
    'listCreators',
    async (_,{rejectWithValue}) => {
        try {
            const response = await fetch(`${backendURL}users/`, {
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
    async ({creatorName}, {rejectWithValue}) => {
        // TODO POST to server to create new "user"
    }
)