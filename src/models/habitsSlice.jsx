import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { habitService } from '../services/habitService';

// Async thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (userId, { rejectWithValue }) => {
    try {
      return await habitService.fetchHabits(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for setting a habit
export const setHabit = createAsyncThunk(
  'habits/setHabit',
  async ({ habitData, userId }) => {
    try {
      return await habitService.setHabit(habitData, userId);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async ({ userId, habitId }, { getState, rejectWithValue }) => {
    try {
      const currentHabits = getState().habits.habits;
      return await habitService.deleteHabit(userId, habitId, currentHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ userId, habitId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const currentHabits = getState().habits.habits;
      return await habitService.updateHabit(userId, habitId, updatedData, currentHabits);
    } catch (error) {
      console.error('Error updating habit:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const markHabitAsDone = createAsyncThunk(
  'habits/markHabitAsDone',
  async ({ userId, habitId }, { getState, rejectWithValue }) => {
    try {
      const currentHabits = getState().habits.habits;
      return await habitService.markHabitAsDone(userId, habitId, currentHabits);
    } catch (error) {
      console.error('Error marking habit as done:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const unmarkHabitAsDone = createAsyncThunk(
  "habits/unmarkHabitAsDone",
  async ({ userId, habitId }, { getState }) => {
    const currentHabits = getState().habits.habits;
    return await habitService.unmarkHabitAsDone(userId, habitId, currentHabits);
  }
);

const initialState = {
  habits: [],
  loading: false,
  error: null,
};

export const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload.habits || [];
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = state.habits.filter(habit => habit.id !== action.payload);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(unmarkHabitAsDone.fulfilled, (state, action) => {
        const { habitId, updated } = action.payload;
        const index = state.habits.findIndex((h) => h.id === habitId);
        if (index !== -1) {
          state.habits[index] = updated;
        }
      })             
      .addCase(updateHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.loading = false;
        const { habitId, updatedData } = action.payload;
        const habitIndex = state.habits.findIndex((habit) => habit.id === habitId);
        if (habitIndex !== -1) {
          state.habits[habitIndex] = {
            ...state.habits[habitIndex],
            ...updatedData,
          };
        }
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markHabitAsDone.fulfilled, (state, action) => {
        const { habitId, date } = action.payload;
        const habit = state.habits.find(h => h.id === habitId);
        if (habit) {
          if (!habit.completedDates) {
            habit.completedDates = [];
          }
          if (!habit.completedDates.includes(date)) {
            habit.completedDates.push(date);
          }
        }
      })
      .addCase(markHabitAsDone.rejected, (state, action) => {
        state.error = action.error.message;
      });      
  }
});

export default habitsSlice.reducer;