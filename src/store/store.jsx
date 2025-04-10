import { configureStore, combineReducers, createListenerMiddleware  } from '@reduxjs/toolkit';
import habitsReducer, { increment, decrement, setHabit, fetchHabits } from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import quotesReducer from '../models/quotesSlice';
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


// Add listeners for actions that change habit state

// Add listener for setHabit to fetch updated habits
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



