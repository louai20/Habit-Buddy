import { configureStore, combineReducers, createListenerMiddleware  } from '@reduxjs/toolkit';
import habitsReducer, { increment, decrement, setHabit, fetchHabits } from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import quotesReducer from '../models/quotesSlice';
import { markHabitAsDone, unmarkHabitAsDone} from "../models/habitsSlice";
import { setDoc, doc } from 'firebase/firestore';
import { db} from '../firebaseConfig';

// Combine all reducers
const rootReducer = combineReducers({
  habits: habitsReducer,
  auth: authReducer,
  weather: weatherReducer,
  quotes: quotesReducer,
});

// Create middleware
const listenerMiddleware = createListenerMiddleware();

// listener for markHabitAsDone to refresh habits

/*
listenerMiddleware.startListening({
  actionCreator: markHabitAsDone.fulfilled,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const userId = state.auth.user?.uid;
    if (userId) {
      listenerApi.dispatch(fetchHabits(userId));
    }
  },
});
*/

listenerMiddleware.startListening({
  actionCreator: markHabitAsDone.fulfilled,
  effect: async (_, listenerApi) => {
    const userId = listenerApi.getState().auth.user?.uid;
    if (userId) {
      listenerApi.dispatch(fetchHabits(userId));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: unmarkHabitAsDone.fulfilled,
  effect: async (_, listenerApi) => {
    const userId = listenerApi.getState().auth.user?.uid;
    if (userId) {
      listenerApi.dispatch(fetchHabits(userId));
    }
  },
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
}); 



