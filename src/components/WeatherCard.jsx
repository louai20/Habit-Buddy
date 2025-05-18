import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherCard = ({ city, currentTemp, forecast }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.cityBlock}>
          <Text style={styles.label}>📍 {city}</Text>
        </View>
        <Text style={styles.temp}>{currentTemp}°</Text>
      </View>

      <View style={styles.forecastRow}>
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
    backgroundColor: '#e7f2fc',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  tempRange: {
    fontSize: 13,
    color: '#333',
  },
});

export default WeatherCard;
