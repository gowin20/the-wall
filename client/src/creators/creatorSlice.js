import { createSlice } from "@reduxjs/toolkit";
import { listCreators } from "./creatorActions";
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
        }
    }
})

export default creatorsSlice.reducer;