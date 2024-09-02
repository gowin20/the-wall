import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';
import identityReducer from './auth/authSlice';
import creatorsReducer from './creators/creatorSlice';
import { authApi } from './auth/authApi';

export const store =  configureStore({
  reducer: {
    wall: wallReducer,
    auth: identityReducer,
    creators: creatorsReducer,
    [authApi.reducerPath]:authApi.reducer
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})


// Type of the entire store
export type AppStore = typeof store;

// Type of the root app state
export type RootState = ReturnType<AppStore['getState']>;

// { wall: WallState, auth: AuthState, creators: CreatorsState, authApi: <CombinedState> }
export type AppDispatch = AppStore['dispatch']