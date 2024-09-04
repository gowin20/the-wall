import { createSlice } from "@reduxjs/toolkit";
import { addCreator } from "./creatorActions";
import { CreatorsList } from "./creatorTypes";
import { creatorsApi } from "./creatorsApi";
// Slice used for the following:
// listing all note creators
// Tracking information related to a selected profile page

interface CreatorsState {
}

const initialState : CreatorsState = {
}

const creatorsSlice = createSlice({
    name:'profiles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(creatorsApi.endpoints.listCreators.matchPending, (state) => {
            console.log('Loading creators...');
        });
        builder.addMatcher(creatorsApi.endpoints.listCreators.matchFulfilled, (state, action) => {
            console.log(`Creators retrieved.`);
        });
        builder.addMatcher(creatorsApi.endpoints.listCreators.matchRejected, (state, action) => {
            console.error(action);
        })

        builder.addMatcher(creatorsApi.endpoints.addCreatorByName.matchFulfilled, (state,action) => {
            console.log('Creator added',action);
        })
        /*
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
            */
    }
})

export default creatorsSlice.reducer;