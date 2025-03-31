import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, provider, db } from "../firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";


// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async actions
export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    // Save user in Firestore if not exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), userData);
    }

    return userData;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerWithEmail = createAsyncThunk("auth/registerWithEmail", async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      name: name,
      email: user.email,
      photoURL: null,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const loginWithEmail = createAsyncThunk("auth/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  return null;
});

// Create Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
