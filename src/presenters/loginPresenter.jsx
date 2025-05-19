import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { LoginView } from '../views/loginView';
import { loginWithEmail } from '../models/authSlice';
import { Alert, Platform } from 'react-native'; // Import Alert
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const LoginPresenter = ({ login, loading, error, user }) => { // Remove navigation from props if using the hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Get navigation object using the hook

  useEffect(() => {
    // If user is logged in, show success alert and redirect
    if (user && user.name) { // Check if user and user.name exist
      const successMessage = `Login successful! Welcome back, ${user.name}.`;
      if (Platform.OS === 'web') {
        window.alert(successMessage);
      } else {
        Alert.alert('Success', successMessage);
      }
      navigation.navigate('MainTabs', { screen: 'dashboard' });
    } else if (user) { // Fallback if user exists but name doesn't
      if (Platform.OS === 'web') {
        window.alert('Login successful! Welcome back.');
      } else {
        Alert.alert('Success', 'Login successful! Welcome back.');
      }
      navigation.navigate('MainTabs', { screen: 'dashboard' });
    }
  }, [user, navigation]);

  // Add useEffect for error alert
  useEffect(() => {
    if (error) {
      // Show error alert if login fails
      if (Platform.OS === 'web') {
        window.alert('Login Failed: incorrect email or password\n' + error);
      } else {
        Alert.alert('Login Failed', 'Incorrect email or password.\n' + error);
      }
    }
  }, [error]);

  const handleSubmit = () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        window.alert('Missing Information: Please fill in both email and password');
      } else {
        Alert.alert('Missing Information', 'Please fill in both email and password');
      }
      return;
    }

    login(email, password);
  };
  return (
    <LoginView
      email={email}
      password={password}
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
  user: state.auth.user, // Check if the user is logged in
});

// map dispatcher to props – no need to use `dispatch` manually in component
const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => dispatch(loginWithEmail({ email, password })),
});

// connect everything to Redux
export default connect(mapStateToProps, mapDispatchToProps)(LoginPresenter);
