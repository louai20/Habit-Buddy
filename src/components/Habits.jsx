import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits, setHabit, increment, decrement } from '../store/habitsSlice';

export function Habits() {
  const dispatch = useDispatch();
  const value = useSelector(state => state.habits.value);

  const handleFetchHabits = () => {
    dispatch(fetchHabits());
  };

  const handleSetHabit = () => {
    console.log('Setting habit:', value);
    dispatch(setHabit({
      id: 'habit_' + Date.now(),
      habitData: {
        value: value
      }
    }));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Habits Counter: {value}</Text>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 10, 
          borderRadius: 5, 
          marginBottom: 10 
        }}
        onPress={handleFetchHabits}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Fetch from Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ 
          backgroundColor: '#34C759', 
          padding: 10, 
          borderRadius: 5, 
          marginBottom: 10 
        }}
        onPress={handleSetHabit}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Send the value to Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ 
          backgroundColor: '#FF3B30', 
          padding: 10, 
          borderRadius: 5, 
          marginBottom: 10 
        }}
        onPress={() => dispatch(decrement())}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Decrement the local value</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ 
          backgroundColor: '#34C759', 
          padding: 10, 
          borderRadius: 5 
        }}
        onPress={() => dispatch(increment())}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Increment the local value</Text>
      </TouchableOpacity>
    </View>
  );
}