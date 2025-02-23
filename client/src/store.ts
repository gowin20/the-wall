import { configureStore } from '@reduxjs/toolkit';
import wallReducer from './wall/wallSlice';
import identityReducer from './auth/authSlice';
import { siteApi } from './api';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store =  configureStore({
  reducer: {
    wall: wallReducer,
    auth: identityReducer,
    [siteApi.reducerPath]:siteApi.reducer
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(siteApi.middleware)
})

setupListeners(store.dispatch);
// Type of the entire store
export type AppStore = typeof store;

// Type of the root app state
export type RootState = ReturnType<AppStore['getState']>;

// { wall: WallState, auth: AuthState, creators: CreatorsState, authApi: <CombinedState> }
export type AppDispatch = AppStore['dispatch']