import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logout, setUser } from '../models/authSlice'; // Your slice actions
import { AuthView } from '../views/authView';
import { db } from '../firebaseConfig'; // Firebase configuration
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthPresenter = ({ user, loading, error, onLogout, onSetUser }) => {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const uidFromStorage = await AsyncStorage.getItem('uid');

        if (uidFromStorage) {
          const userDoc = await getDoc(doc(db, 'users', uidFromStorage));
        

          if (userDoc.exists()) {
            const userData = userDoc.data();
            onSetUser({
              uid: userData.uid,
              name: userData.name,
              email: userData.email,
              photoURL: userData.photoURL,
            });
          } else {
            console.error('User does not exist');
            onLogout();
          }
        } else {
          console.log('No UID found in AsyncStorage');
          onLogout();
        }
      } catch (error) {
        console.error('Error checking user in Firestore:', error);
        onLogout();
      }
    };

    checkUser();
  }, [onLogout, onSetUser]);

  return (
    <AuthView
      user={user}
      loading={loading}
      error={error}
      onLogout={onLogout}
    />
  );
};

// Mapping Redux state to component props
const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
});

// Mapping Redux dispatch actions to component props
const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(logout());
    AsyncStorage.removeItem('uid'); // Remove uid from AsyncStorage
  },
  onSetUser: (user) => dispatch(setUser(user)), // Store user in Redux state
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthPresenter);
