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
        zoom: null,
        focus: {
            note:null, // note ID
            loading:false,
            position:{
                row:null, // TODO initialize these values based on the current ROUTE
                col:null
            },
            controlsEnabled:true
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

            if (state.focus.loading) return; // Can't move focus while a note is still loading
            if (action.payload.row >= state.layout.numRows || action.payload.row < 0) return; // Can't move out of bounds
            if (action.payload.col >= state.layout.numCols || action.payload.col < 0) return;

            state.focus.loading = true;
            state.focus.controlsEnabled = false;
            state.focus.position = action.payload;
            // Derive current note from layout position
            state.focus.note = state.layout.array[state.focus.position.row][state.focus.position.col];
            
            // Once state.focus.note updates, the <Wall/> component opens focus mode.
        },
        imageLoaded: (state) => {
            state.focus.loading = false;
            state.focus.controlsEnabled = true;
        },
        clearFocus: (state) => {
            state.focus.position = {
                row:null,
                col:null
            };
            state.focus.note = null;
        },
        disableControls: (state) => {
            state.focus.controlsEnabled = false;
        },
        enableControls: (state) => {
            state.focus.controlsEnabled = true;
        },
        updateZoom: (state, {payload}) => {
            state.zoom = payload;
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

export const {setLayout,setFocusByPosition,setFocusByNote,clearFocus,disableControls,enableControls,updateZoom,imageLoaded} = wallSlice.actions;

export default wallSlice.reducer;