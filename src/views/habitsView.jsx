import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../models/quotesSlice';
import { fetchWeather } from '../models/weatherSlice';
import { markHabitAsDone } from '../models/habitsSlice';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native';

export function HabitsView({ habits }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector((state) => state.auth.user); // Get username for the header
  const { quote, loading: quoteLoading, error: quoteError } = useSelector(state => state.quotes);
  const { current, forecast, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);
  const userHabits = useSelector((state) => state.habits.habits);

  const today = new Date().toISOString().split('T')[0];

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

  const markedDates = {};
  userHabits?.forEach((habit) => {
    const completed = habit.completedDates || [];
    completed.forEach((date) => {
      markedDates[date] = { marked: true, dotColor: '#00adf5' };
    });
  });  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Gradient Header */}
      <View style={styles.welcomeCard}>
        <Text style={styles.greeting}>
          👋 Welcome Back{user?.name ? `, ${user.name}` : ''}!
        </Text>
        <Text style={styles.subGreeting}>Let’s make today productive 💪</Text>
      </View>

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
            <Text style={styles.current}>Temperature {current.temperature}°C, Wind {current.windspeed} km/h</Text>
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

      {/* 📅 Calendar Section */}
            <View style={styles.card}>
        <Text style={styles.sectionTitle}>📆 Habit Calendar</Text>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          theme={calendarTheme}
        />
      </View>

      {/* Habits Section */}
      <Text style={styles.sectionTitle}>📋 Your Habits</Text>
      {userHabits?.length > 0 ? (
        userHabits.map((habit) => {
          const updatedHabit = userHabits.find(h => h.id === habit.id);
          const completedDates = updatedHabit?.completedDates || [];          
          const isDoneToday = completedDates.includes(today);

          return (
            <View key={habit.id} style={styles.habitItem}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <TouchableOpacity
                style={[styles.doneButton, isDoneToday && styles.doneButtonComplete]}
                disabled={isDoneToday}
                onPress={() =>
                  dispatch(markHabitAsDone({ userId: user.id, habitId: habit.id }))
                }
              >
                <Text style={isDoneToday ? styles.doneTextComplete : styles.doneText}>
                  {isDoneToday ? '✅ Done' : 'Mark as Done'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
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

const calendarTheme = {
  todayTextColor: '#007bff',
  dotColor: '#00adf5',
  arrowColor: '#007bff',
  monthTextColor: '#333',
  textDayFontWeight: '500',
  textMonthFontWeight: '700',
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#28a745', 
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonComplete: {
    backgroundColor: '#cce5ff', 
  },
  doneText: {
    color: '#fff',
    fontWeight: '600',
  },
  doneTextComplete: {
    color: '#004085',
    fontWeight: '600',
  },
  
  subGreeting: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#666',
  },  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  quoteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#444',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },  
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
    color: '#444',
  },
  current: {
    fontSize: 20,    
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  habitItem: {
    backgroundColor: '#d0ebff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
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
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },  
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  forecastItem: {
    width: '30%',
    padding: 10,
    backgroundColor: '#edf6ff',
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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