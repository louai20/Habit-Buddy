import { configureStore, combineReducers, createListenerMiddleware  } from '@reduxjs/toolkit';
import habitsReducer, { setHabit, fetchHabits } from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import quotesReducer from '../models/quotesSlice';
import { markHabitAsDone, unmarkHabitAsDone} from "../models/habitsSlice";

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


listenerMiddleware.startListening({
  actionCreator: setHabit.fulfilled,
  effect: async (action, listenerApi) => {
    console.log("side effect for setHabit, calling fetchHabits", action.payload);
    const state = listenerApi.getState();
    if (state.auth.user?.uid) {
      listenerApi.dispatch(fetchHabits(state.auth.user.uid));
    }
  },
}); 

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
}); 



