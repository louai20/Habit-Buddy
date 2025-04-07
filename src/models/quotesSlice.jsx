import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch a motivational quote
export const fetchQuote = createAsyncThunk(
  'quotes/fetchQuote',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await response.json();
      return {
        text: data[0].q,
        author: data[0].a,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quote: null,
  loading: false,
  error: null,
};

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    clearQuote: (state) => {
      state.quote = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuote } = quotesSlice.actions;
export default quotesSlice.reducer;
