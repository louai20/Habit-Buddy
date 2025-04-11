import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../models/quotesSlice';
import { fetchWeather } from '../models/weatherSlice';
import { useNavigation } from '@react-navigation/native';

export function HabitsView({ habits }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { quote, loading: quoteLoading, error: quoteError } = useSelector(state => state.quotes);
  const { current, forecast, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);

  useEffect(() => {
    dispatch(fetchQuote());

    // Get current location and fetch weather
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch(fetchWeather({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => {
        console.error("Location error:", err.message);
      }
    );
  }, [dispatch]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👋 Welcome Back!</Text>

      {/* Quote Section */}
      <View style={styles.card}>
        <Text style={styles.quoteTitle}>✨ Daily Motivation ✨</Text>

        {quoteLoading ? (
          <Text style={styles.loading}>Loading quote...</Text>
        ) : quoteError ? (
          <Text style={styles.error}>Quote error: {quoteError}</Text>
        ) : quote ? (
          <>
            <Text style={styles.quote}>"{quote.text}" — {quote.author}</Text>
            <View style={styles.buttonWrapper}>
              <Button title="NEW QUOTE" onPress={() => dispatch(fetchQuote())} color="#007bff" />
            </View>
          </>
        ) : null}
      </View>

      {/* Weather Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌤️ Current Weather</Text>
        {weatherLoading ? (
          <Text style={styles.loading}>Loading weather...</Text>
        ) : weatherError ? (
          <Text style={styles.error}>Weather error: {weatherError}</Text>
        ) : current ? (
          <>
            <Text style={styles.weather}>{current.temperature}°C, Wind {current.windspeed} km/h</Text>
            <Text style={styles.sectionTitle}>📅 7-Day Forecast</Text>
            <View style={styles.forecastContainer}>
              {forecast?.time?.map((date, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDate}>
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </Text>
                  <Text style={styles.forecastTemp}>
                    {forecast.temperature_2m_min[index]}° / {forecast.temperature_2m_max[index]}°
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </View>

      {/* Habits Section */}
      <Text style={styles.sectionTitle}>📋 Your Habits</Text>
      {habits?.length > 0 ? (
        habits.map((habit) => (
          <View key={habit.id} style={styles.habitItem}>
            <Text style={styles.habitName}>{habit.name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noHabits}>No habits yet</Text>
      )}

      {/* Add Habit Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="+ ADD NEW HABIT"
          onPress={() => navigation.navigate('addHabit')}
          color="#007bff"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  current: {
    fontSize: 16,
  },
  habitItem: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  habitName: {
    fontSize: 16,
  },
  noHabits: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  forecast: {
    fontSize: 14,
    color: '#333',
  },  
  loading: {
    fontSize: 14,
    color: '#aaa',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  forecastItem: {
    width: '30%',
    padding: 8,
    backgroundColor: '#e7f3ff',
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  forecastDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  forecastTemp: {
    fontSize: 13,
    color: '#444',
  },  
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});