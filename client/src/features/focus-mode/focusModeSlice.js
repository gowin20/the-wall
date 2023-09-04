import { createSlice } from "@reduxjs/toolkit";
// handle the properties of current active layout
//(be it for the primary wall, user profile wall, or other custom wall)

export const focusModeSlice = createSlice({
    name:'focusMode',
    initialState: {
      note:null, // NoteObject
      position:null // position in current active layout
    },
    reducers: {
        setFocusedNote: (state,action) => {
            //Input: Atlas layout object
            state.note = action.payload;
        }
    }
})

export const {setLayout} = focusModeSlice.actions;

export default focusModeSlice.reducer;