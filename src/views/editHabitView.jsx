import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list';

export function EditHabitView({  user, habits, onUpdateHabit, onDeleteHabit }) {
  const route = useRoute();
  const navigation = useNavigation();
  const habitFromRoute = route.params?.habit;

  // Add useEffect to update form when navigation params change
  useEffect(() => {
    if (habitFromRoute) {
      setSelectedHabit(habitFromRoute);
      setHabitData({
        name: habitFromRoute.name || '',
        description: habitFromRoute.description || '',
        frequency: habitFromRoute.frequency || '',
        startDate: new Date(habitFromRoute.startDate),
        endDate: new Date(habitFromRoute.endDate),
      });
    }
  }, [route.params]); // Listen to route params changes

  const [selectedHabit, setSelectedHabit] = useState(habitFromRoute);
  const [habitData, setHabitData] = useState({
    name: habitFromRoute?.name || '',
    description: habitFromRoute?.description || '',
    frequency: habitFromRoute?.frequency || '',
    startDate: new Date(habitFromRoute?.startDate) || new Date(),
    endDate: new Date(habitFromRoute?.endDate) || new Date(),
  });

  const [startDateInput, setStartDateInput] = useState(habitData.startDate.toISOString().split('T')[0]);
  const [endDateInput, setEndDateInput] = useState(habitData.endDate.toISOString().split('T')[0]);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setHabitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
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

    const updatedHabit = {
        ...habitData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
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
        navigation.navigate('habit'); 
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


  return (
    <View style={styles.container}>

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
              />
            </View>

            {/* Start Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Date</Text>
              {(
                <Input
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  style={styles.webDateInput}
                />
              )}
            </View>

            {/* End Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>End Date</Text>
              {(
                <Input
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
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