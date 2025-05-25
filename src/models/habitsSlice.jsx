import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { habitService } from '../services/habitService';

export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (userId) => {
    console.log('Fetching habits for user:', userId); // Add this line for debuggi
    return await habitService.fetchHabits(userId);
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
  reducers: {
    setHabits: (state, action) => {
      state.habits = action.payload;
      state.loading = false;
      state.error = null;
    },
    addHabit: (state, action) => {
      state.loading = true;
      state.error = null;
      const newHabit = {
        id: Date.now().toString(),
        ...action.payload,
        completedDates: []
      };
      state.habits.push(newHabit);
    },
    deleteHabit: (state, action) => {
      state.loading = true;
      state.error = null;
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    },
    updateHabit: (state, action) => {
      state.loading = true;
      state.error = null;
      const { habitId, updatedData } = action.payload;
      const habitIndex = state.habits.findIndex(habit => habit.id === habitId);
      if (habitIndex !== -1) {
        state.habits[habitIndex] = {
          ...state.habits[habitIndex],
          ...updatedData
        };
      }
    },
    markHabitAsDone: (state, action) => {
      state.loading = true;
      state.error = null;
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
    },
    unmarkHabitAsDone: (state, action) => {
      state.loading = true;
      state.error = null;
      const { habitId, date } = action.payload;
      const habit = state.habits.find(h => h.id === habitId);
      if (habit && habit.completedDates) {
        habit.completedDates = habit.completedDates.filter(d => d !== date);
      }
    },
    habitActionSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    habitActionError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload.habits || [];
        state.error = null;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch habits';
      });
  }
});

export const { 
  setHabits,
  addHabit,
  deleteHabit,
  updateHabit,
  markHabitAsDone,
  unmarkHabitAsDone,
  habitActionSuccess,
  habitActionError
} = habitsSlice.actions;

export default habitsSlice.reducer;