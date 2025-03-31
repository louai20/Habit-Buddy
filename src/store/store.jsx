import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    auth: authReducer,
    weather: weatherReducer,
  },
}); 