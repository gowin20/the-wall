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
            loading:false,
            position:{
                row:null,
                col:null
            },
            controls: {
                enabled:true
            }
        }
    },
    reducers: {
        setLayout: (state,action) => {
            //Input: Atlas layout object
            state.layout = action.payload;
        },
        setFocusByNote: (state, action) => {
            state.focus.note = action.payload;
            // this function is not currently necessary but will be used if we ever implement a "view on wall" button
        },
        setFocusByPosition: (state,action) => {
            // TODO disable this function while "loading"
            if (state.focus.loading) return;
            if (action.payload.row >= state.layout.numRows || action.payload.row < 0) return;
            if (action.payload.col >= state.layout.numCols || action.payload.col < 0) return;

            state.focus.loading = true;
            state.focus.controls.enabled = false;
            state.focus.position = action.payload;
            // Derive current note from layout position
            state.focus.note = state.layout.array[state.focus.position.row][state.focus.position.col];
        },
        imageLoaded: (state) => {
            state.focus.loading = false;
            state.focus.controls.enabled = true;
        },
        clearFocus: (state) => {
            state.focus.position = {
                row:null,
                col:null
            };
            state.focus.note = null;
        },
        disableControls: (state) => {
            state.focus.controls.enabled = false;
        },
        enableControls: (state) => {
            state.focus.controls.enabled = true;
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

export const {setLayout,setFocusByPosition,setFocusByNote,clearFocus,disableControls,enableControls,imageLoaded} = wallSlice.actions;

export default wallSlice.reducer;