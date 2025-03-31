import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from '../models/habitsSlice';
import authReducer from '../models/authSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    auth: authReducer
  },
}); 