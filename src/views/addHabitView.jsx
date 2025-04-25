import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,  // Add this import
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';

export function AddHabitView({ user, onSetHabit }) {
  const navigation = useNavigation();
  
  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    frequency: 'Daily', // Set default value
    startDate: new Date(),
    endDate: new Date(),
  });

  const [startDateInput, setStartDateInput] = useState(habitData.startDate.toISOString().split('T')[0]);
  const [endDateInput, setEndDateInput] = useState(habitData.endDate.toISOString().split('T')[0]);

  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setHabitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!habitData.name.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Empty name');
      } else {
        Alert.alert('Empty name');
      }
      return;
    }

    const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str).getTime());

    if (!isValidDate(startDateInput) || !isValidDate(endDateInput)) {
      if (Platform.OS === 'web') {
        window.alert('Invalid Date');
      } else {
        Alert.alert('Invalid Date');
      }
      return;
    }


    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
  
    if (endDate < startDate) {
      if (Platform.OS === 'web') {
        window.alert('End date cannot be before start date.');
      } else {
        Alert.alert('End date cannot be before start date.');
      }
      return;
    }

    try {
      const newHabit = {
        ...habitData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
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
      navigation.navigate('dashboard');
    } catch (error) {
      console.error('AddHabitView: Error adding habit:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
          <SelectList
            setSelected={(value) => handleInputChange('frequency', value)}
            data={[
              {key: 'Daily', value: 'Daily'},
              {key: 'Weekly', value: 'Weekly'},
              {key: 'Monthly', value: 'Monthly'},
            ]}
            save="value"
            defaultOption={{ key: habitData.frequency, value: habitData.frequency }}
            search={false}
            boxStyles={styles.selectBox}
            dropdownStyles={styles.dropdownContainer}
            dropdownItemStyles={styles.dropdownItem}
            dropdownTextStyles={styles.dropdownText}
            inputStyles={styles.selectInput}
            onFocus={() => {
              // Add focus effect if needed
            }}
          />
        </View>
    
        {/* Start Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Date</Text>
          {Platform.OS === 'web' ? (
            <Input
              type="date"
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
              style={styles.webDateInput}
            />
          ) : (
            <>
              <Pressable
                style={styles.dateButton}
                onPress={() => setIsStartPickerOpen(true)}
              >
                <Text style={styles.dateButtonText}>
                  {startDateInput}
                </Text>
              </Pressable>
              <DateTimePickerModal
                isVisible={isStartPickerOpen}
                mode="date" 
                date={habitData.startDate}
                onConfirm={(date) => {
                  setIsStartPickerOpen(false);
                  setStartDateInput(date);
                }}
                onCancel={() => setIsStartPickerOpen(false)}
              />
            </>
          )}
        </View>
    
        {/* End Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>End Date</Text>
          {Platform.OS === 'web' ? (
            <Input
              type="date"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
              style={styles.webDateInput}
            />
          ) : (
            <>
              <Pressable
                style={styles.dateButton}
                onPress={() => setIsEndPickerOpen(true)}
              >
                <Text style={styles.dateButtonText}>
                  {endDateInput}
                </Text>
              </Pressable>
              <DateTimePickerModal
                isVisible={isEndPickerOpen}
                mode="date" // 👈 NEW
                minimumDate={habitData.startDate}
                date={habitData.endDate}
                onConfirm={(date) => {
                  setIsEndPickerOpen(false);
                  setEndDateInput(date);
                }}
                onCancel={() => setIsEndPickerOpen(false)}
              />
            </>
          )}
        </View>
    
        {/* Submit */}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Habit</Text>
        </Pressable>
      </ScrollView>
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
  selectBox: {
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
    cursor: 'pointer', // Add cursor pointer for web
  },
  selectInput: {
    color: '#374151',
    fontSize: 16,
    ':hover': {
      color: '#1f2937',
    },
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 12,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
    boxShadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    padding: 12,
    ':hover': {
      backgroundColor: '#f3f4f6',
    },
    cursor: 'pointer', // Add cursor pointer for web
  },
  dropdownText: {
    color: '#374151',
    fontSize: 16,
  },
});