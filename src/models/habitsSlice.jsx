import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, query, orderBy, addDoc, where, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from "../firebaseConfig";

const DOCUMENT = "users";

// Async thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (userId, { rejectWithValue }) => {
    try {
      console.log(`Fetching habits for user: ${userId}`);
      const docSnapshot = await getDoc(doc(db, DOCUMENT, userId));
      if (docSnapshot.exists()) {
        console.log("habits found", docSnapshot.data());
        return docSnapshot.data(); 
      } else {
        return rejectWithValue('Habit not found'); 
      }
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
      const userHabitsDoc = doc(db, DOCUMENT, userId);
      
      // Create a new habit with a unique ID
      const newHabit = {
        id: Date.now().toString(), // Simple unique ID using timestamp
        ...habitData
      };
  
      await setDoc(userHabitsDoc, {
        habits: arrayUnion(newHabit)
      }, { merge: true });
  
      console.log('Habit successfully added:', newHabit);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async ({ userId, habitId }, { getState, rejectWithValue }) => {
    try {
      console.log('SLICE: Delete habit:', habitId);
      const userHabitsDoc = doc(db, DOCUMENT, userId);

      const currentHabits = getState().habits.habits;

      if (currentHabits.length === 0) {
        throw new Error('No habits found in the store');
      }

      const updatedHabits = currentHabits.filter(habit => habit.id !== habitId);

      if (updatedHabits.length === currentHabits.length) {
        throw new Error('Habit to delete was not found.');
      }

      await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });

      return habitId;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return rejectWithValue(error.message);
    }
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
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
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
      });
  }
});

export const { increment, decrement } = habitsSlice.actions;
export default habitsSlice.reducer; 