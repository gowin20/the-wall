import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';
import identityReducer from './auth/authSlice';
import creatorsReducer from './creators/creatorSlice';
import { authApi } from './auth/authApi';

export default configureStore({
  reducer: {
    wall: wallReducer,
    auth: identityReducer,
    creators: creatorsReducer,
    [authApi.reducerPath]:authApi.reducer
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})