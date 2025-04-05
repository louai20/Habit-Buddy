import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  token: null,
};

// Register with Email
export const registerWithEmail = createAsyncThunk("auth/registerWithEmail", async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Save the user's uid to localStorage
    AsyncStorage.setItem("uid", user.uid);
    // Set displayName after registration
    await updateProfile(user, { displayName: name });

    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    return userData;
  } catch (error) {
    return rejectWithValue(error.message || "An unknown error occurred");
  }
});

// Login with Email
export const loginWithEmail = createAsyncThunk("auth/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save the user's uid to localStorage
    AsyncStorage.setItem("uid", user.uid);

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error("Login failed: ", error.message); // Log the error message
    return rejectWithValue(error.message);
  }
});
// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth); // Sign out from Firebase
  AsyncStorage.removeItem("uid"); // Remove the uid from localStorage
  return null; // Clear user data from Redux store
});


// Create Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the user data
    setUser: (state, action) => {
      state.user = action.payload;  // Save user data in the state
    },
    // Action to set loading state (for example, during async operations)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Action to set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null; // Clear token on logout
      })
  },
});
export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
