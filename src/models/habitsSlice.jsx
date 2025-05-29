import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  habits: [],
  loading: false,
  error: null,
};

export const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Add new reducers for handling fetch states
    fetchHabitsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHabitsSuccess: (state, action) => {
      state.loading = false;
      state.habits = action.payload.habits || [];
      state.error = null;
    },
    fetchHabitsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
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
  // Remove extraReducers entirely
});

export const { 
  fetchHabitsStart,
  fetchHabitsSuccess,
  fetchHabitsError,
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