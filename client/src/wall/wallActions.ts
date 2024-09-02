import { createAsyncThunk } from "@reduxjs/toolkit";
import {store} from "../store";
import { SERVER_DOMAIN } from "../config";
import { NoteId, NoteInfo } from "./wallTypes";
import { AuthToken } from "../auth/authTypes";

// TODO rebuild as api function


interface NoteUpdate {
    _id: NoteId;
    info: NoteInfo
} 

export const patchNote = createAsyncThunk(
    'patchNote',
    async ({_id, info} : NoteUpdate,{rejectWithValue}) => {
        try {
            const token = store.getState().auth.userToken;
            // noteInfo must contain valid note info params, specifially:
            /*
            do NOT accept thumbnails, tiles, orig, or _id as params
            */
            console.log('Token:',token)
            const response = await fetch(`${SERVER_DOMAIN}notes/id/${_id}`, {
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