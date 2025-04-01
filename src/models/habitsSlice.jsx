import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, query, doc, setDoc } from 'firebase/firestore';
import { db} from '../firebaseConfig';

// Async thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetching habits");
      const docSnapshot = await getDoc(doc(db, 'habits', "testDocuments"));
      if (docSnapshot.exists()) {
        return docSnapshot.data().value; 
      } else {
        return rejectWithValue('Habit not found'); 
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for setting a habit
/* export const setHabit = createAsyncThunk(
  'habits/setHabit',
  async ({ id, habitData }, { rejectWithValue }) => {
    try {
      console.log("setting habit", habitData);
      const habitRef = doc(db, 'habits', "testDocuments");
      await setDoc(habitRef, habitData, { merge: true });
      return habitData.value;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
); */

const initialState = {
  value: 0,  // Simple numeric value
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
      state.value = action.payload;
    })
    .addCase(fetchHabits.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  }
});

export const { increment, decrement } = habitsSlice.actions;
export default habitsSlice.reducer; 