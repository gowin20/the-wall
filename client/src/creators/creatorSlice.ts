import { createSlice } from "@reduxjs/toolkit";
import { listCreators, addCreator } from "./creatorActions";
import { CreatorObject, UserObject } from "./creatorTypes";
// Slice used for the following:
// listing all note creators
// Tracking information related to a selected profile page

type Creator = UserObject | CreatorObject;

interface CreatorState {
    creatorList: {
        loaded:Boolean;
        items: Array<Creator>
    }
}

const initialState : CreatorState = {
    creatorList: {
        loaded:false,
        items:[]
    }
}

const creatorsSlice = createSlice({
    name:'profiles',
    initialState,
    reducers: {},
    extraReducers: builder => {

        // List creators API call
        builder.addCase(listCreators.pending, state => {
            console.log('Loading creators...')
        })
        builder.addCase(listCreators.fulfilled, (state, action) => {
            console.log(`Creators retrieved.`)

            state.creatorList = {
                loaded:true,
                items:action.payload
            }
        })
        builder.addCase(listCreators.rejected, (state, response) => {
            console.error(response)
        })

        // Add creator API call
        builder.addCase(addCreator.pending, (state) => {
            console.log('Adding creator...')
        })
        builder.addCase(addCreator.fulfilled, (state, {payload}) => {
            console.log('Creator added.')
            state.creatorList.items = [...state.creatorList.items, payload];
        });
        builder.addCase(addCreator.rejected, (state, response) => {
            console.error(response);
        })
    }
})

export default creatorsSlice.reducer;