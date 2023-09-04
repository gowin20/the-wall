import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';

export default configureStore({
  reducer: {
    wall: wallReducer
  },
})