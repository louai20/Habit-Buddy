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
      console.log('SLICE: Delete for user userId:', userId);
      const userHabitsDoc = doc(db, DOCUMENT, userId);

      const currentHabits = getState().habits.habits;
      console.log('SLICE: currentHabits:', currentHabits);

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

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ userId, habitId, updatedData }, { getState, rejectWithValue }) => {
    try {

      console.log("Slice habitId:", habitId);
      console.log('SLICE: updatedData:', updatedData);
      console.log("Slice userId:", userId);

      const userHabitsDoc = doc(db, DOCUMENT, userId);

      const currentHabits = getState().habits.habits;

      if (currentHabits.length === 0) {
        throw new Error('No habits found.');
      }


      const updatedHabits = currentHabits.map(habit =>
        habit.id === habitId ? { ...habit, ...updatedData } : habit
      );

      
      // Firestore update
      await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });
      console.log('SLICE: updatedHabits');

      return { habitId, updatedData };
    } catch (error) {
      console.error('Error updating habit:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for marking a habit as done today
export const markHabitAsDone = createAsyncThunk(
  'habits/markHabitAsDone',
  async ({ userId, habitId }, { getState, rejectWithValue }) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      const userHabitsDoc = doc(db, DOCUMENT, userId);
      const currentHabits = getState().habits.habits;

      const updatedHabits = currentHabits.map(habit => {
        if (habit.id === habitId) {
          const existing = habit.completedDates || [];
          const alreadyDone = existing.includes(today);

          return alreadyDone
            ? habit
            : {
                ...habit,
                completedDates: [...existing, today],
              };
        }
        return habit;
      });

      await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });

      return { habitId, date: today };
    } catch (error) {
      console.error('Error marking habit as done:', error);
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
      })
      .addCase(updateHabit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.loading = false;
        const { habitId, updatedData } = action.payload; // Get habitId and updatedData from action.payload

        // Find the habit in the current state that matches the habitId
        const habitIndex = state.habits.findIndex((habit) => habit.id === habitId);
        console.log('habitIndex', habitIndex);

        if (habitIndex !== -1) {
          console.log('updating in extrareducer');
          // Update the habit with new data
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

export const { increment, decrement } = habitsSlice.actions;
export default habitsSlice.reducer; 