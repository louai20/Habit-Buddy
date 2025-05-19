import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export function AuthView(props) {
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object

  return (
    <View style={styles.container}>
      {props.loading && <Text>Loading...</Text>}
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
      {props.user && props.user.uid ? (
        <View style={styles.rowContainer}>
          <Text style={styles.welcomeText}>Welcome, {props.user.name}</Text>
          <Pressable style={styles.button} onPress={props.onLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      ) : (
        []
      )}
    </View>
  );
}

// Styles for compact and better design
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'center', // Center the buttons
    maxWidth: 500, // Limit width for larger screens
    flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    borderRadius: 6, // Slightly smaller border radius
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Smaller text
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#28a745', // Different color for the register button
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
