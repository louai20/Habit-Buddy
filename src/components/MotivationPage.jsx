import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../models/quotesSlice';
import { fetchWeather } from '../models/weatherSlice';
import { Button } from 'react-native';

export default function MotivationPage() {
  const dispatch = useDispatch();

  const { quote, loading: quoteLoading, error: quoteError } = useSelector(state => state.quotes);
  const { weather, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);

  useEffect(() => {
    dispatch(fetchQuote());

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch(fetchWeather({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => console.error("Location error:", err)
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✨ Daily Motivation ✨</Text>

      {quoteLoading ? (
        <ActivityIndicator size="large" />
      ) : quoteError ? (
        <Text style={styles.error}>Quote error: {quoteError}</Text>
      ) : quote ? (
        <Text style={styles.quote}>"{quote.text}" — {quote.author}</Text>
      ) : null}

      <Button title="New Quote" onPress={() => dispatch(fetchQuote())} />

      {weatherLoading ? (
        <ActivityIndicator size="small" />
      ) : weatherError ? (
        <Text style={styles.error}>Weather error: {weatherError}</Text>
      ) : weather ? (
        <Text style={styles.weather}>🌤️ {weather.temperature}°C | 💨 {weather.windspeed} km/h</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  quote: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  weather: { fontSize: 16 },
  error: { color: 'red', marginTop: 10 },
});
