import { configureStore, combineReducers } from '@reduxjs/toolkit';
import habitsReducer from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import quotesReducer from '../models/quotesSlice';
import { firebaseListenerMiddleware } from '../middleware/firebaseListenerMiddleware';

// Combine all reducers
const rootReducer = combineReducers({
  habits: habitsReducer,
  auth: authReducer,
  weather: weatherReducer,
  quotes: quotesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(firebaseListenerMiddleware),
});



