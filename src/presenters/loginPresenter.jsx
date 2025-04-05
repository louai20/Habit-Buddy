import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { LoginView } from '../views/loginView';
import { loginWithEmail } from '../models/authSlice';

const LoginPresenter = ({ login, loading, error, user, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    // If user is already logged in, redirect to habits page
    if (user) {
      navigation.navigate('habits'); // Navigate to the habits page
    }
  }, [user, navigation]);

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Please fill in both email and password');
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
      error={error}
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
