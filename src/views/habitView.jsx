import { View, Text, FlatList, StyleSheet, Pressable, Platform, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export function HabitView({ user, habits, onDeleteHabit }) {
  const navigation = useNavigation();
  const [deletingHabitId, setDeletingHabitId] = useState(null);

  const handleDelete = async ({ userId, habitId }) => {
    try {
      setDeletingHabitId(habitId);
      await onDeleteHabit({ userId, habitId });
      if (Platform.OS === 'web') {
        window.alert("Habit deleted successfully!");
      } else {
        Alert.alert(
          "Success",
          "Habit deleted successfully!"
        );
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert("Failed to delete habit. Please try again.");
      } else {
        Alert.alert(
          "Error",
          "Failed to delete habit. Please try again."
        );
      }
    } finally {
      setDeletingHabitId(null);
    }
  };

  const renderHabitItem = ({ item }) => (
    <View style={styles.habitItem}>
      <View style={styles.habitContent}>
        <Text style={styles.habitName}>{item.name}</Text>
        <Text style={styles.habitDescription}>{item.description}</Text>
        <Text style={styles.habitFrequency}>Frequency: {item.frequency}</Text>
        <View style={styles.habitDates}>
          <View>
            <Text style={styles.dateText}>
              Start: {new Date(item.startDate).toLocaleDateString()}
            </Text>
            <Text style={[styles.dateText, styles.endDate]}>
              End: {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.editButton, styles.trackerButton]}
          onPress={() => navigation.navigate('habitTracker', { habit: item })}
        >
          <Text style={styles.buttonText}>Track</Text>
        </Pressable>
        <Pressable 
          style={styles.editButton}
          onPress={() => navigation.navigate('editHabit', { habit: item })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable 
          style={[styles.editButton, styles.deleteButton]}
          onPress={() => handleDelete({ userId: user.uid, habitId: item.id })}
          disabled={deletingHabitId === item.id}
        >
          <Text style={styles.buttonText}>
            {deletingHabitId === item.id ? 'Deleting...' : 'Delete'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Habits</Text>
      {habits && habits.length > 0 ? (
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>No habits found. Start by adding a new habit!</Text>
      )}
      <Pressable 
        style={styles.addButton}
        onPress={() => navigation.navigate('addHabit')}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  listContent: {
    paddingBottom: 20,
  },
  habitItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.04)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitContent: {
    flex: 1,
    marginRight: 12,
  },
  editButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  habitDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  habitFrequency: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  habitDates: {
    marginTop: 8,
  },
  endDate: {
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    marginTop: -2,
  },
  trackerButton: {
    backgroundColor: '#10b981', // Green color for the tracker button
  },
});