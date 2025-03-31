import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { db} from '../firebaseConfig';

// Async thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const habitsQuery = query(
        collection(db, 'habits'),
      );
      const querySnapshot = await getDocs(habitsQuery);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().value;
      }
      return 0;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for setting a habit
export const setHabit = createAsyncThunk(
  'habits/setHabit',
  async ({ id, habitData }, { rejectWithValue }) => {
    try {
      const habitRef = doc(db, 'habits', "testDocuments");
      await setDoc(habitRef, habitData, { merge: true });
      return habitData.value;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  value: 0  // Simple numeric value
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
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(setHabit.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  }
});

export const { increment, decrement } = habitsSlice.actions;
export default habitsSlice.reducer; 