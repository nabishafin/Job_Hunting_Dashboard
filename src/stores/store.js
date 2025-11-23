import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './userSlice';
import { baseApi } from '../redux/api/baseApi'; // Import baseApi
import { setupListeners } from '@reduxjs/toolkit/query'; // Import setupListeners

const persistConfig = {
  key: 'root',
  storage,
  // Whitelist specifies which reducers to persist. If userSlice.js contains user, isAuthenticated, and accessToken,
  // then we should just persist the whole user slice.
  whitelist: ['user'], // Only persist the user slice
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    [baseApi.reducerPath]: baseApi.reducer, // Add baseApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(baseApi.middleware), // Add baseApi middleware
});

setupListeners(store.dispatch); // Setup listeners for RTK Query

const persistor = persistStore(store);

export { store, persistor };
