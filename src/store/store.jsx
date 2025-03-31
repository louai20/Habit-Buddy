import { configureStore, combineReducers } from '@reduxjs/toolkit';
import habitsReducer from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from "redux-persist/lib/storage/session"; // Use sessionStorage instead of localStorage

// Persist config for Redux Persist
const persistConfig = {
  key: 'root',    // The key in storage
  storage: storageSession,        // Use localStorage for persistence
  whitelist: ["user"],
  blacklist: ['auth.register'],
};
// Apply persistReducer only to the auth slices
const persistedAuthReducer = persistReducer(persistConfig, (authReducer));

// Combine all reducers
const rootReducer = combineReducers({
  habits: habitsReducer,
  auth: persistedAuthReducer,
  weather: weatherReducer,
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types or paths in the state
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['auth.user'], // Ignore checking 'user' in auth
      },
    }),
}); 

export const persistor = persistStore(store);

