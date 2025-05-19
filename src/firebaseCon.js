import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAovpeEyWYcqOhlqH-VfVfLgkJdzIoqfKg",
  authDomain: "habitstracker-832f2.firebaseapp.com",
  projectId: "habitstracker-832f2",
  storageBucket: "habitstracker-832f2.firebasestorage.app",
  messagingSenderId: "570259014928",
  appId: "1:570259014928:web:19b28b48a8e648ca035195"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  // Use default web Auth initialization
  auth = getAuth(app);
} else {
  // Use persistence for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };