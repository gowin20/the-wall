import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';
import identityReducer from './auth/identitySlice';

export default configureStore({
  reducer: {
    wall: wallReducer,
    auth: identityReducer
  },
})