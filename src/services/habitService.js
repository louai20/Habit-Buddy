import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../firebaseCon";

const DOCUMENT = "users";

export const habitService = {
  fetchHabits: async (userId) => {
    const docSnapshot = await getDoc(doc(db, DOCUMENT, userId));
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
    throw new Error('Habit not found');
  },

  setHabit: async (habitData, userId) => {
    const userHabitsDoc = doc(db, DOCUMENT, userId);
    const newHabit = {
      id: Date.now().toString(),
      ...habitData
    };
    await setDoc(userHabitsDoc, {
      habits: arrayUnion(newHabit)
    }, { merge: true });
    return newHabit;
  },

  deleteHabit: async (userId, habitId, currentHabits) => {
    const userHabitsDoc = doc(db, DOCUMENT, userId);
    if (currentHabits.length === 0) {
      throw new Error('No habits found in the store');
    }
    const updatedHabits = currentHabits.filter(habit => habit.id !== habitId);
    if (updatedHabits.length === currentHabits.length) {
      throw new Error('Habit to delete was not found.');
    }
    await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });
    return habitId;
  },

  updateHabit: async (userId, habitId, updatedData, currentHabits) => {
    const userHabitsDoc = doc(db, DOCUMENT, userId);
    if (currentHabits.length === 0) {
      throw new Error('No habits found.');
    }
    const updatedHabits = currentHabits.map(habit =>
      habit.id === habitId ? { ...habit, ...updatedData } : habit
    );
    await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });
    return { habitId, updatedData };
  },

  markHabitAsDone: async (userId, habitId, currentHabits) => {
    const today = new Date().toISOString().split('T')[0];
    const userHabitsDoc = doc(db, DOCUMENT, userId);
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
  },

  unmarkHabitAsDone: async (userId, habitId, currentHabits) => {
    const userHabitsDoc = doc(db, DOCUMENT, userId);
    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = currentHabits.map((habit) => {
      if (habit.id === habitId) {
        return {
          ...habit,
          completedDates: (habit.completedDates || []).filter(
            (date) => date !== today
          ),
        };
      }
      return habit;
    });
    await setDoc(userHabitsDoc, { habits: updatedHabits }, { merge: true });
    return { habitId, updated: updatedHabits.find((h) => h.id === habitId) };
  }
};