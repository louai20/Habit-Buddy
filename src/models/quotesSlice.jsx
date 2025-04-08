import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch a motivational quote
export const fetchQuote = createAsyncThunk(
  'quotes/fetchQuote',
  async (_, { rejectWithValue }) => {
    try {
      // Bust cache with timestamp
      const timestamp = new Date().getTime();
      const url = `https://api.allorigins.win/raw?url=${encodeURIComponent("https://zenquotes.io/api/random")}&_=${timestamp}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("ZenQuotes fetch failed");

      const data = await response.json();
      if (!Array.isArray(data) || !data[0]?.q || data[0]?.q.includes("Too many requests")) {
        throw new Error("ZenQuotes rate limit or malformed response");
      }

      return {
        text: data[0].q,
        author: data[0].a,
      };
    } catch (error) {
      const staticQuotes = [
        { text: "Stay hungry. Stay foolish.", author: "Steve Jobs" },
        { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
        { text: "Do something today that your future self will thank you for.", author: "Unknown" },
        { text: "Consistency is key. Keep showing up.", author: "Habit Buddy" },
        { text: "Small steps every day lead to big change.", author: "Habit Buddy" },
      ];
      const random = staticQuotes[Math.floor(Math.random() * staticQuotes.length)];
      return random;
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
