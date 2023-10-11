import { createAsyncThunk } from "@reduxjs/toolkit";
const backendURL = 'http://localhost:5050/';

export const logIn = createAsyncThunk(
    'users/loginStatus',
    async ({username, password}, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}users/login`, {
                method:'POST',
                body: JSON.stringify({
                    username:username,
                    password:password
                }),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if (response.status == 401) return rejectWithValue((await response.json()).message);

            const data = await response.json();
            localStorage.setItem('userToken',data.token);
            console.log(localStorage.getItem('userToken'))
            return data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)