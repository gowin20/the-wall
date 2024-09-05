import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';
import identityReducer from './auth/authSlice';
import creatorsReducer from './creators/creatorSlice';
import { siteApi } from './api';

export const store =  configureStore({
  reducer: {
    wall: wallReducer,
    auth: identityReducer,
    creators: creatorsReducer,
    [siteApi.reducerPath]:siteApi.reducer
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(siteApi.middleware)
})


// Type of the entire store
export type AppStore = typeof store;

// Type of the root app state
export type RootState = ReturnType<AppStore['getState']>;

// { wall: WallState, auth: AuthState, creators: CreatorsState, authApi: <CombinedState> }
export type AppDispatch = AppStore['dispatch']