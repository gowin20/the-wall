import { createAsyncThunk } from "@reduxjs/toolkit";
import {store} from "../store";
const backendURL = 'http://localhost:5050/';

export const patchNote = createAsyncThunk(
    'patchNote',
    async (note,{rejectWithValue}) => {
        const id = note.id;
        const info = note.info;
        if (info._id || info.orig || info.thumbnails || info.tiles) return rejectWithValue('Cannot edit protected value.');
        try {
            const token = store.getState().auth.userToken;
            // noteInfo must contain valid note info params, specifially:
            /*
            do NOT accept thumbnails, tiles, orig, or _id as params
            */
            console.log('Token:',token)
            const response = await fetch(`${backendURL}notes/id/${id}`, {
                method:'PATCH',
                body: JSON.stringify(info),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':token
                }
            });
            if (response.status == 401) return rejectWithValue((await response.json()).message);

            return (await response.json()).message;
        }
        catch (e) {
            return rejectWithValue(e);
        }
    }
)