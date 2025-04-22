import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function UnauthorizedView() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Required</Text>
      <Text style={styles.message}>
        Please sign in or register to manage your habits
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
  },
  registerButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});