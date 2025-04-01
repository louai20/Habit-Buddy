import { configureStore, combineReducers, createListenerMiddleware  } from '@reduxjs/toolkit';
import habitsReducer, { increment, decrement } from '../models/habitsSlice';
import authReducer from '../models/authSlice';
import weatherReducer from '../models/weatherSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from "redux-persist/lib/storage/session"; // Use sessionStorage instead of localStorage
import { setDoc, doc } from 'firebase/firestore';
import { db} from '../firebaseConfig';


// Persist config for Redux Persist
const persistConfig = {
  key: 'root',    // The key in storage
  storage: storageSession,        // Use localStorage for persistence
  whitelist: ["user"],
  blacklist: ['auth.register'],
};
// Apply persistReducer only to the auth slices
const persistedAuthReducer = persistReducer(persistConfig, (authReducer));

// Combine all reducers
const rootReducer = combineReducers({
  habits: habitsReducer,
  auth: persistedAuthReducer,
  weather: weatherReducer,
});

// for side effects with middleware --------------------------------
const listenerMiddleware = createListenerMiddleware();

const saveHabitToFirestore = async (value) => {
  try {
    const habitRef = doc(db, 'habits', 'testDocuments');
    await setDoc(habitRef, { value }, { merge: true });
  } catch (error) {
    console.error('Error updating Firestore:', error);
  }
};

// Add listeners for actions that change habit state
listenerMiddleware.startListening({
  actionCreator: increment,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    console.log("time to persist habits by middleware:", action.payload, listenerApi.getState());
    await saveHabitToFirestore(state.habits.value);
  },
});

listenerMiddleware.startListening({
  actionCreator: decrement,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    console.log("time to persist habits by middleware:", action.payload, listenerApi.getState());
    await saveHabitToFirestore(state.habits.value);
  },
});
// ---------------------------------------------------------------

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types or paths in the state
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['auth.user'], // Ignore checking 'user' in auth
      },
    }).prepend(listenerMiddleware.middleware),
}); 

export const persistor = persistStore(store);


