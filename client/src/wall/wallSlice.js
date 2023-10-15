import { createSlice } from "@reduxjs/toolkit";
import { patchNote } from "./wallActions";

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
            position:{
                row:null,
                col:null
            } // {row:Int, col:Int}
        },
        userList: null
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
        clearFocus: (state) => {
            state.focus.position = {
                row:null,
                col:null
            };
            state.focus.note = null;
        }
    },
    extraReducers: {
        [patchNote.pending]: (state) => {
            console.log('Edit pending');
        },
        [patchNote.fulfilled]: (state, {payload}) => {
            console.log(`Edit note succeeded: ${payload}`);
        },
        [patchNote.rejected]: (state, {payload}) => {
            console.error(`Edit note failed: ${payload}`);
        }
    }
})

export const {setLayout,setFocusByPosition,setFocusByNote, clearFocus} = wallSlice.actions;

export default wallSlice.reducer;