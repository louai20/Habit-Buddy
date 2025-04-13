import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';

export function EditHabitView({  user, habits, onUpdateHabit, onDeleteHabit }) {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    frequency: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setHabitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!habitData.name.trim()) {
      Alert.alert('EditHabitView: Name is empty');
      return;
    }

    if (habitData.endDate < habitData.startDate) {
      Alert.alert('EditHabitView: End date is before start date');
      return;
    }

    try {

    const updatedHabit = {
        ...habitData,
        startDate: habitData.startDate.toISOString(),
        endDate: habitData.endDate.toISOString(),
        };

       await onUpdateHabit( {userId: user.uid, 
         habitId: selectedHabit.id, 
         updatedData: updatedHabit 
      });
      console.log('VIEW: Habit updated successfully!');

      if (Platform.OS === 'web') {
        window.alert('Success\n\nHabit updated successfully!');
        } else {
        Alert.alert('Success', 'Habit updated successfully!');
        }
    } catch (error) {
      Alert.alert('EditHabitView: Error updating habit:', error);
    }
  };

  const handleDelete = async (habitId) => {
    try {
      await onDeleteHabit({ userId: user.uid, habitId: habitId });
      if (selectedHabit?.id === habitId) {
        setSelectedHabit(null);
        setHabitData({
          name: '',
          description: '',
          frequency: '',
          startDate: new Date(),
          endDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleSelectHabit = (habit) => {
    setSelectedHabit(habit);
    setHabitData({
      name: habit.name || '',
      description: habit.description || '',
      frequency: habit.frequency || '',
      startDate: new Date(habit.startDate) || new Date(),
      endDate: new Date(habit.endDate) || new Date(),
    });
  };

  const renderHabitItem = ({ item }) => (
    <Pressable
      style={[
        styles.habitItem,
        selectedHabit?.id === item.id && styles.selectedHabitItem
      ]}
      onPress={() => handleSelectHabit(item)}
    >
      <Text style={styles.habitName}>{item.name}</Text>
      <Text style={styles.habitDescription}>{item.description}</Text>
      <Text style={styles.habitFrequency}>Frequency: {item.frequency}</Text>
      <View style={styles.habitDates}>
        <Text style={styles.dateText}>
          Start: {new Date(item.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.dateText}>
          End: {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
        {/*List of Habits*/}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Your Habits</Text>
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/*Form to edit the selected habit*/}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {selectedHabit ? 'Edit Habit' : 'Select a Habit to Edit'}
        </Text>
        {selectedHabit ? (
          <ScrollView style={styles.formScroll}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                value={habitData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="e.g., Meditate"
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={habitData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="What is this habit about?"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Frequency */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Frequency</Text>
              <TextInput
                style={styles.input}
                value={habitData.frequency}
                onChangeText={(text) => handleInputChange('frequency', text)}
                placeholder="e.g., Daily, Weekly"
              />
            </View>

            {/* Start Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Date</Text>
              {(
                <input
                  type="date"
                  value={habitData.startDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    handleInputChange('startDate', new Date(e.target.value))
                  }
                  style={styles.webDateInput}
                />
              )}
            </View>

            {/* End Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>End Date</Text>
              {(
                <input
                  type="date"
                  value={habitData.endDate.toISOString().split('T')[0]}
                  min={habitData.startDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    handleInputChange('endDate', new Date(e.target.value))
                  }
                  style={styles.webDateInput}
                />
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Habit</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(selectedHabit.id)}>
                <Text style={styles.buttonText}>Delete Habit</Text>
              </Pressable>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Select a habit from the list to edit</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  habitItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.04,
    boxShadowRadius: 3,
    boxShadowOffset: { width: 0, height: 2 },
  },
  selectedHabitItem: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  habitFrequency: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  habitDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 6,
    borderRadius: 20,
    alignItems: 'center',
    width: 80,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  formScroll: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    boxShadowColor: '#000',
    boxShadowOpacity: 0.04,
    boxShadowRadius: 3,
    boxShadowOffset: { width: 0, height: 2 },
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    boxShadowColor: '#000',
    boxShadowOpacity: 0.04,
    boxShadowRadius: 3,
    boxShadowOffset: { width: 0, height: 2 },
  },
  webDateInput: {
    padding: 14,
    borderWidth: 0,
    borderColor: '#fff',
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.1,
    boxShadowRadius: 6,
    boxShadowOffset: { width: 0, height: 4 },
  },
  updateButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 