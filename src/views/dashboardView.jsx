import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WeatherCard from '../components/WeatherCard';

export function DashboardView({
  user,
  habits,
  quote,
  quoteLoading,
  quoteError,
  currentWeather,
  weatherForecast,
  weatherLoading,
  weatherError,
  city,
  locationDenied,
  locationError,
  onFetchQuote,
  onFetchWeather,
  onMarkHabitAsDone,
  onUnmarkHabitAsDone,
}) {
  const navigation = useNavigation();
  const today = new Date().toISOString().split('T')[0];
  const [localDone, setLocalDone] = useState({});

  const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
  const scheduledToday = habits.filter(h => today >= h.startDate && today <= h.endDate).length;
  const topHabit = habits.reduce((top, h) => {
    const count = h.completedDates?.length || 0;
    return count > (top.count || 0) ? { name: h.name, count } : top;
  }, { name: '-', count: 0 });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.welcomeCard}>
        <Text style={styles.greeting}>
          👋 Welcome Back{user?.name ? `, ${user.name}` : ''}!
        </Text>
        <Text style={styles.subGreeting}>Let’s make today productive 💪</Text>
        <Image
          source={{
            uri: `https://api.dicebear.com/9.x/adventurer/png?seed=${user?.avatarSeed || 'Easton'}`,
          }}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => navigation.navigate('avatarPicker')}
        >
          <Text style={styles.changeButtonText}>Change Avatar</Text>
        </TouchableOpacity>
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
            <TouchableOpacity style={styles.smallButton} onPress={onFetchQuote}>
              <Text style={styles.smallButtonText}>NEW QUOTE</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {/* Weather Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌤️ Weather</Text>
        {weatherLoading ? (
          <Text style={styles.loading}>Loading weather...</Text>
        ) : currentWeather ? (
          <WeatherCard
            city={city}
            currentTemp={currentWeather.temperature}
            forecast={weatherForecast.time.slice(0, 5).map((date, i) => ({
              day: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
              tempMin: weatherForecast.temperature_2m_min[i],
              tempMax: weatherForecast.temperature_2m_max[i],
            }))}
          />
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
      {habits?.length > 0 ? (
        <View style={styles.habitGrid}>
          {habits.map((habit) => {
            const isDoneToday = localDone[habit.id] ?? habit.completedDates?.includes(today);

            return (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <TouchableOpacity
                  style={[styles.doneButton, isDoneToday && styles.doneButtonComplete]}
                  onPress={() => {
                    const currentlyDone = localDone[habit.id] ?? habit.completedDates?.includes(today);

                    if (currentlyDone) {
                      onUnmarkHabitAsDone({ userId: user.uid, habitId: habit.id });
                      setLocalDone(prev => ({ ...prev, [habit.id]: false }));
                    } else {
                      onMarkHabitAsDone({ userId: user.uid, habitId: habit.id });
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
    marginTop: 5,
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  smallButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
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