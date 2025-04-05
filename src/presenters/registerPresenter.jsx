import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RegisterView } from '../views/registerView';
import { registerWithEmail } from '../models/authSlice';

const RegisterPresenter = ({ register, loading, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !password) {
      alert('Please fill in all fields');
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
      error={error}
    />
  );
};

// map Redux state to props
const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error,
});

// map dispatcher to props – no need to use `dispatch` manually in component
const mapDispatchToProps = (dispatch) => ({
  register: (email, password, name) =>
    dispatch(registerWithEmail({ email, password, name })),
});

// connect everything to Redux
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPresenter);
