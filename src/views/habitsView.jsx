import { View, Text, StyleSheet } from 'react-native';

export function HabitsView({ habits }) {
    console.log("rendering habits view with habits", habits);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Habits</Text>
      {habits?.length > 0 ? (
        habits.map((habit) => (
          <View key={habit.id} style={styles.habitItem}>
            <Text style={styles.habitName}>Habit name: {habit.name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noHabits}>No habits yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  habitItem: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
  },
  noHabits: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
