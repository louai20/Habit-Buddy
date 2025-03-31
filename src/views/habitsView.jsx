import { View, Text, TouchableOpacity } from "react-native";

export function HabitsView(props) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Habits Counter: {props.value}</Text>
      
      <TouchableOpacity style={styles.buttonBlue} onPress={props.onFetchHabits}>
        <Text style={styles.textWhite}>Fetch from Firebase</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonGreen} onPress={() => props.onSetHabit(props.value)}>
        <Text style={styles.textWhite}>Send the value to Firebase</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonRed} onPress={props.onDecrement}>
        <Text style={styles.textWhite}>Decrement the local value</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonGreen} onPress={props.onIncrement}>
        <Text style={styles.textWhite}>Increment the local value</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = {
  buttonBlue: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonGreen: { backgroundColor: "#34C759", padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonRed: { backgroundColor: "#FF3B30", padding: 10, borderRadius: 5, marginBottom: 10 },
  textWhite: { color: "white", textAlign: "center" },
};