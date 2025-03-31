//example for api calls
//call weatherapi:
// weather: () => dispatch(fetchWeather({ latitude: 40.7128, longitude: -74.0060 })
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching weather data using fetch
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }

    const data = await response.json();
              // Print the full API response to the console
              console.log('API Response:', data);
    return data.current_weather;
  }
);

// Initial state
const initialState = {
  weather: null,
  loading: false,
  error: null,
};

// Slice to manage weather state
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default weatherSlice.reducer;
