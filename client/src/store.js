import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './features/wall/wallSlice';

export default configureStore({
  reducer: {
    wall: wallReducer
  },
})