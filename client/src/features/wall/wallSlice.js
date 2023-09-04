import { createSlice } from "@reduxjs/toolkit";
// handle the properties of current active layout
//(be it for the primary wall, user profile wall, or other custom wall)

export const wallSlice = createSlice({
    name:'wall',
    initialState: {
        layout: {
            image:null
        } // layout object
    },
    reducers: {
        setLayout: (state,action) => {
            //Input: Atlas layout object
            state.layout = action.payload;
        }
    }
})

export const {setLayout} = wallSlice.actions;

export default wallSlice.reducer;