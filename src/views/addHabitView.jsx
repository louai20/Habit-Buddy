import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';

export function AddHabitView({ user, onSetHabit }) {
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

  const handleSubmit = async () => {
    if (!habitData.name.trim()) {
      console.log('AddHabitView: Name is empty');
      return;
    }

    if (habitData.endDate < habitData.startDate) {
      console.log('AddHabitView: End date is before start date');
      return;
    }

    try {
      const newHabit = {
        ...habitData,
        startDate: habitData.startDate.toISOString(),
        endDate: habitData.endDate.toISOString(),
      };

     
      await onSetHabit(newHabit, user.uid);
      console.log('AddHabitView: Habit added successfully');
      if (Platform.OS === 'web') {
        window.alert('Success\n\nHabit added successfully!');
      } else {
        Alert.alert('Success', 'Habit added successfully!');
      }
      
      // Reset form data
      setHabitData({
        name: '',
        description: '',
        frequency: '',
        startDate: new Date(),
        endDate: new Date(),
      });
      console.log('AddHabitView: Form data reset');
    } catch (error) {
      console.error('AddHabitView: Error adding habit:', error);
    }
  };

  return (
    <View style={styles.container}>
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
        { (
          <input
            type="date"
            value={habitData.startDate.toISOString().split('T')[0]}
            onChange={(e) =>
              handleInputChange('startDate', new Date(e.target.value))
            }
            style={styles.webDateInput}
          />
        ) }
      </View>

      {/* End Date */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date</Text>
        { (
          <input
            type="date"
            value={habitData.endDate.toISOString().split('T')[0]}
            min={habitData.startDate.toISOString().split('T')[0]}
            onChange={(e) =>
              handleInputChange('endDate', new Date(e.target.value))
            }
            style={styles.webDateInput}
          />
        ) }
      </View>

      {/* Submit */}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1f2937',
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
  dateButtonText: {
    color: '#1f2937',
    fontSize: 16,
  },
  webDateInput: {
    padding: 14,
    borderWidth: 0, 
    borderColor: '#fff', 
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.1,
    boxShadowRadius: 6,
    boxShadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  loginMessage: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
});