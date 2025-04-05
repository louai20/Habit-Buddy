import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export function HabitsView(props) {
  console.log("rendering habits view");

  return (
    <View style={{ padding: 20 }}>
      {/* Display Loading State */}
      {props.loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.text}>Loading habits...</Text>
        </View>
      )}

      {/* Display Error State */}
      {props.error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {props.error}</Text>
        </View>
      )}

      {/* Display Habit Counter Value */}
      {!props.loading && !props.error && (
        <>
          <Text style={styles.title}>Habits Counter: {props.value}</Text>

          <TouchableOpacity style={styles.buttonRed} onPress={props.onDecrement}>
            <Text style={styles.textWhite}>Decrement the local value</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonGreen} onPress={props.onIncrement}>
            <Text style={styles.textWhite}>Increment the local value</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBlue: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonGreen: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRed: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textWhite: {
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginTop: 10,
    textAlign: "center",
  },
})
