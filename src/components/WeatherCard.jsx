import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherCard = ({ city, currentTemp, forecast }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.temp}>{currentTemp}°</Text>
      </View>

      <View style={styles.forecastContainer}>
        {forecast.map((day, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.day}>{day.day}</Text>
            <Text style={styles.tempRange}>{day.tempMin}° / {day.tempMax}°</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  forecastItem: {
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
  },
  tempRange: {
    fontSize: 13,
    color: '#444',
  },
});

export default WeatherCard;