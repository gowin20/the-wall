import { createSlice } from "@reduxjs/toolkit";
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
            console.error("Error listing creator: ",action);
        })

        builder.addMatcher(creatorsApi.endpoints.addCreatorByName.matchFulfilled, (state,action) => {
            console.log('Creator added',action);
        })
        builder.addMatcher(creatorsApi.endpoints.addCreatorByName.matchRejected, (state,action) => {
            console.error('Error adding creator: ',action);
        })
    }
})

export default creatorsSlice.reducer;