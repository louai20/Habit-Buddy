import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebaseCon";
import { habitActionSuccess, habitActionError } from '../models/habitsSlice';

const DOCUMENT = "users";

export const firebaseListenerMiddleware = store => next => action => {
  const result = next(action);
  
  if (action?.type?.startsWith('habits/') && 
      action.type !== 'habits/habitActionSuccess' && 
      action.type !== 'habits/habitActionError' &&
      !action.type.startsWith("habits/fetchHabits")) {
    const state = store.getState();
    const userId = state.auth.user?.uid;
    
    if (userId) {
      const userHabitsDoc = doc(db, DOCUMENT, userId);
    
      console.log('Saving habits to Firebase for user:', userId);
      console.log('Habits:', state.habits.habits); // Add this line for debugging
      setDoc(userHabitsDoc, {
        habits: state.habits.habits
      }, { merge: true })
      .then(() => {
        store.dispatch(habitActionSuccess());
      })
      .catch(error => {
        console.error('Error syncing with Firebase:', error);
        store.dispatch(habitActionError(error.message));
      });
    }
  }
  
  return result;
};