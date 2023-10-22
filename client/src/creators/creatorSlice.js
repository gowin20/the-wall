import { createSlice } from "@reduxjs/toolkit";
import { listCreators, addCreator } from "./creatorActions";
// Slice used for the following:
// listing all note creators
// Tracking information related to a selected profile page

const creatorsSlice = createSlice({
    name:'profiles',
    initialState:{
        creatorList: {
            loaded:false
        }
    },
    extraReducers:{
        [listCreators.pending]: (state) => {
            console.log('Loading creators...')
        },
        [listCreators.fulfilled]: (state, {payload}) => {
            console.log(`Creators retrieved.`)

            state.creatorList = {
                loaded:true,
                items:payload
            }
        },
        [listCreators.rejected]: (state, response) => {
            console.error(response)
        },
        [addCreator.pending]: (state) => {
            console.log('Adding creator...')
        },
        [addCreator.fulfilled]: (state, {payload}) => {
            console.log('Creator added.')
            state.creatorList.items = [...state.creatorList, payload];
        },
        [addCreator.rejected]: (state, response) => {
            console.error(response);
        }
    }
})

export default creatorsSlice.reducer;