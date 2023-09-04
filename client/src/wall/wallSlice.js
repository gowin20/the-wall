import { createSlice } from "@reduxjs/toolkit";
// handle the properties of current active layout
//(be it for the primary wall, user profile wall, or other custom wall)

export const wallSlice = createSlice({
    name:'wall',
    initialState: {
        layout: { // full mongo layout object
            image:null
        },
        focus: {
            note:null, // note ID
            position:null // {row:Int, col:Int}
        }
    },
    reducers: {
        setLayout: (state,action) => {
            //Input: Atlas layout object
            state.layout = action.payload;
        },
        setFocusByNote: (state, action) => {
            state.focus.note = action.payload;

            // TODO derive current position in layout from note
        },
        setFocusByPosition: (state,action) => {

            if (action.payload.row >= state.layout.numRows || action.payload.row < 0) return;
            if (action.payload.col >= state.layout.numCols || action.payload.col < 0) return;

            state.focus.position = action.payload;

            // Derive current note from layout position
            state.focus.note = state.layout.array[state.focus.position.row][state.focus.position.col];
        },
        clearFocus: (state,action) => {
            state.focus.position = null;
            state.focus.note = null;
        }
    }
})

export const {setLayout,setFocusByPosition,setFocusByNote, clearFocus} = wallSlice.actions;

export default wallSlice.reducer;