import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../models/quotesSlice';
import { fetchWeather } from '../models/weatherSlice';
import { markHabitAsDone, unmarkHabitAsDone } from '../models/habitsSlice';
import * as Location from 'expo-location'; 
import { Calendar } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';

export function DashboardView({ habits }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector((state) => state.auth.user); // Get username for the header
  const { quote, loading: quoteLoading, error: quoteError } = useSelector(state => state.quotes);
  const { current, forecast, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);
  const userHabits = useSelector((state) => state.habits.habits);

  const today = new Date().toISOString().split('T')[0];
  const [locationError, setLocationError] = useState('');
  const [localDone, setLocalDone] = useState({});
  const [locationDenied, setLocationDenied] = useState(false);
  const completedToday = userHabits.filter(h => h.completedDates?.includes(today)).length;
  const scheduledToday = userHabits.filter(h => today >= h.startDate && today <= h.endDate).length;
  const topHabit = userHabits.reduce((top, h) => {
    const count = h.completedDates?.length || 0;
    return count > (top.count || 0) ? { name: h.name, count } : top;
  }, { name: '-', count: 0 });
  const [hasAskedLocationPermission, setHasAskedLocationPermission] = useState(false);
  useEffect(() => {
    dispatch(fetchQuote());
    
    if (!hasAskedLocationPermission) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationDenied(true);
          setHasAskedLocationPermission(true); // Mark as asked
          setLocationError('Location permission not granted.');
          console.error("Location permission not granted.");
          return;
        }

        try {
          let location = await Location.getCurrentPositionAsync({});
          dispatch(fetchWeather({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }));
          setLocationDenied(false); // Reset if permission is granted
          setLocationError('');
          setHasAskedLocationPermission(true); // Mark as asked
        } catch (err) {
          console.error('Error getting location:', err);
          setLocationDenied(true);
          setLocationError('Error getting location: ' + err.message);
          setHasAskedLocationPermission(true); // Mark as asked even if there's an error
        }
      })();
    }
  }, [dispatch, hasAskedLocationPermission]);
  const markedDates = {};
  userHabits?.forEach((habit) => {
    const completed = habit.completedDates || [];
    completed.forEach((date) => {
      markedDates[date] = { marked: true, dotColor: '#00adf5' };
    });
  });  
    const handleLocationRequest = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // Location permission granted, now get the current position
        let location = await Location.getCurrentPositionAsync({});
        dispatch(fetchWeather({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
        setLocationDenied(false); // Reset location denied state
      } else {
        setLocationDenied(true); // If permission denied, set state
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    } catch (err) {
      // Catch errors, log them and display a message
      console.error("Error getting location:", err);
      setLocationDenied(true);
      Alert.alert('Error', 'Unable to retrieve location. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Gradient Header */}
      <View style={styles.welcomeCard}>
        <Text style={styles.greeting}>
          👋 Welcome Back{user?.name ? `, ${user.name}` : ''}!
        </Text>
        <Text style={styles.subGreeting}>Let’s make today productive 💪</Text>
        <Image
          source={{
            uri: `https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.avatarSeed || 'Easton'}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.changeButton}>
          <Button
            title="Change Avatar"
            onPress={() => navigation.navigate('avatarPicker')}
          />
        </View>
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
        ) : locationDenied ? (
          <TouchableOpacity onPress={async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              try {
                let location = await Location.getCurrentPositionAsync({});
                dispatch(fetchWeather({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }));
                setLocationDenied(false);
              } catch (err) {
                setLocationDenied(true); // Set state for error if location can't be fetched
              }
            } else {
              setLocationDenied(true); // Optionally notify if the permission is still denied
            }
          }}>
            <Text style={styles.permissionPrompt}>
              📍 Location access needed. Tap here to allow.
            </Text>
          </TouchableOpacity>
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

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>✅ Completed Today</Text>
          <Text style={styles.progressValue}>{completedToday}</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>📅 Scheduled Today</Text>
          <Text style={styles.progressValue}>{scheduledToday}</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>🏆 Top Habit</Text>
          <Text style={styles.progressValue}>{topHabit.name}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("progress")}
        style={{
          backgroundColor: '#4a90e2',
          padding: 12,
          borderRadius: 8,
          marginVertical: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          📊 View Progress
        </Text>
      </TouchableOpacity>

      {/* Habits Section */}
      <Text style={styles.sectionTitle}>📋 Your Habits</Text>
      {userHabits?.length > 0 ? (
        <View style={styles.habitGrid}>
          {userHabits.map((habit) => {
            const updatedHabit = userHabits.find(h => h.id === habit.id);
            const completedDates = updatedHabit?.completedDates || [];          
            const isDoneToday = localDone[habit.id] ?? completedDates.includes(today);

            return (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <TouchableOpacity
                  style={[styles.doneButton, isDoneToday && styles.doneButtonComplete]}
                  onPress={() => {
                    const currentlyDone = localDone[habit.id] ?? completedDates.includes(today);
                  
                    if (currentlyDone) {
                      dispatch(unmarkHabitAsDone({ userId: user.uid, habitId: habit.id }));
                      setLocalDone(prev => ({ ...prev, [habit.id]: false }));
                    } else {
                      dispatch(markHabitAsDone({ userId: user.uid, habitId: habit.id }));
                      setLocalDone(prev => ({ ...prev, [habit.id]: true }));
                    }
                  }}                
                >
                  <Text style={isDoneToday ? styles.doneTextComplete : styles.doneText}>
                    {isDoneToday ? '✅ Done' : 'Mark as Done'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
  changeButton: {
    width: 140,
    marginTop: 5,
  },
  habitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitItem: {
    backgroundColor: '#d0ebff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    width: '48%', // This makes it 2 columns
  },  
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 22,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
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
    boxShadowColor: '#000',
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
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
    boxShadowColor: '#000',
    boxShadowOffset: { width: 0, height: 3 },
    boxShadowOpacity: 0.08,
    boxShadowRadius: 6,
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
    boxShadowColor: '#000',
    boxShadowOffset: { width: 0, height: 1 },
    boxShadowOpacity: 0.05,
    boxShadowRadius: 2,
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