import { db } from '../firebaseCon';
import { doc, getDoc } from 'firebase/firestore';

const DOCUMENT = "users";

export const habitService = {
  async fetchHabits(userId) {
    try {
      const docSnapshot = await getDoc(doc(db, DOCUMENT, userId));
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        throw new Error('Habit not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch habits: ' + error.message);
    }
  }
};