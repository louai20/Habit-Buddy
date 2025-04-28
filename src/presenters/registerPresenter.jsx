import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RegisterView } from '../views/registerView';
import { registerWithEmail } from '../models/authSlice';
import { Alert } from 'react-native'; // Import Alert
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const RegisterPresenter = ({ register, loading, error, user }) => { // Add user to props
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Get navigation object

  // Add useEffect for redirection and success alert
  useEffect(() => {
    if (user) {
      // Show success alert before navigating
      Alert.alert('Success', `Registration successful! Welcome, ${user.name}.`);
      navigation.navigate('dashboard'); // Navigate to dashboard on successful registration/login
    }
  }, [user, navigation]);

  // Add useEffect for error alert
  useEffect(() => {
    if (error) {
      // Show error alert if registration fails
      Alert.alert('Registration Failed', error);
    }
  }, [error]);

  const handleSubmit = () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    // Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    register(email, password, name);
  };

  return (
    <RegisterView
      name={name}
      email={email}
      password={password}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      loading={loading}
      // Pass error to the view if you want to display it there too, otherwise remove
      // error={error}
    />
  );
};

// map Redux state to props
const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error,
  user: state.auth.user, // Add user state to props
});

// map dispatcher to props – no need to use `dispatch` manually in component
const mapDispatchToProps = (dispatch) => ({
  register: (email, password, name) =>
    dispatch(registerWithEmail({ email, password, name })),
});

// connect everything to Redux
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPresenter);
