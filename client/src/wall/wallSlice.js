import { createSlice } from "@reduxjs/toolkit";
import { patchNote } from "./wallActions";

// handle the properties of current active layout
//(be it for the primary wall, user profile wall, or other custom wall)

export const wallSlice = createSlice({
    name:'wall',
    initialState: {
        layoutLoaded:false,
        layout: { // full mongo layout object
            image:null
        },
        zoom: null,
        focus: {
            note:null, // note ID
            loading:false,
            initialized:false,
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
            state.layoutLoaded = true;
        },
        // Set the focus by searching for a note ID in the layout's 2d array - O(mn)
        setFocusByNote: (state, action) => {
            // This function only executes when a note is loaded from a router URL. Return if things have already been initialized.
            if (state.focus.initialized || !state.layoutLoaded) return;

            state.focus.loading = true;
            state.focus.controlsEnabled = false;

            // Set focused note
            state.focus.note = action.payload;

            // Find row and column based on note ID
            for (let i=0;i<state.layout.array.length;i++){
                for (let j=0;j<state.layout.array[i].length;j++) {
                    if (state.layout.array[i][j] === action.payload) {
                        state.focus.position = {
                            row:i,
                            col:j
                        }
                    }
                }
            }
            state.focus.initialized = true;
        },

        // Set the focus by accessing a row and column in the layout's 2d array - O(1)
        setFocusByPosition: (state,action) => {
            if (state.focus.loading || !state.layoutLoaded) return; // Can't change focus while things are loading
            if (action.payload.row >= state.layout.numRows || action.payload.row < 0) return; // Can't move out of bounds
            if (action.payload.col >= state.layout.numCols || action.payload.col < 0) return;

            state.focus.loading = true;
            state.focus.controlsEnabled = false;

            // Set row and column
            state.focus.position = action.payload;
            // Set note ID by accessing layout
            state.focus.note = state.layout.array[state.focus.position.row][state.focus.position.col];

            state.focus.initialized = true;
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