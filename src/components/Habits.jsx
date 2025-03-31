import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";

export function Habits({ authPresenter }) {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.habits.value);

  const handleFetchHabits = () => {
    dispatch(fetchHabits());
  };

  const handleSetHabit = () => {
    console.log("Setting habit:", value);
    dispatch(
      setHabit({
        id: "habit_" + Date.now(),
        habitData: {
          value: value,
        },
      })
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Habits Counter: {value}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={handleFetchHabits}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Fetch from Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#34C759",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={handleSetHabit}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Send the value to Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#FF3B30",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={() => dispatch(decrement())}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Decrement the local value</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#34C759",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() => dispatch(increment())}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Increment the local value</Text>
      </TouchableOpacity>

      {/* Authentication Buttons */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FF9500",
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={() => authPresenter.loginWithGoogle()}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#FF3B30",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={() => authPresenter.logout()}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
