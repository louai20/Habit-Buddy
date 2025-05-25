import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

export function HabitTrackerView({
  user,
  habits,
  loading,
  error,
  onMarkHabitDone,
  onUnmarkHabitDone,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const habitFromRoute = route.params?.habit;
  const today = new Date().toISOString().split("T")[0];
  const [localDone, setLocalDone] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (habitFromRoute?.completedDates) {
      const marked = {};
      const currentDate = new Date();
      const startDate = new Date(habitFromRoute.startDate);
      const endDate = new Date(habitFromRoute.endDate);

      // Iterate through all dates from start to today
      for (
        let d = new Date(startDate);
        d <= currentDate && d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateString = d.toISOString().split("T")[0];

        if (habitFromRoute.completedDates.includes(dateString)) {
          // Completed dates in green
          marked[dateString] = {
            selected: true,
            selectedColor: "#059669",
          };
        } else if (d < currentDate) {
          // Past uncompleted dates in orange (only if within range and before today)
          marked[dateString] = {
            selected: true,
            selectedColor: "#f97316",
          };
        }
      }
      setMarkedDates(marked);
    }
  }, [habitFromRoute]);

  if (!habitFromRoute) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No habit selected for tracking.</Text>
      </View>
    );
  }


  const handleDateSelect = (day) => {
    const date = day.dateString;
    const selectedDate = new Date(date);
    const startDate = new Date(habitFromRoute.startDate);
    const endDate = new Date(habitFromRoute.endDate);

    // Check if the selected date is within the valid range
    if (selectedDate < startDate || selectedDate > endDate) {
      return; // Exit if date is outside valid range
    }

    // Check if the date is already marked as completed (green)
    const isCompleted = markedDates[date]?.selectedColor === "#059669";

    if (isCompleted) {
      // If date was completed, unmark it
      onUnmarkHabitDone(user.uid, habitFromRoute.id, date);
      const newMarkedDates = { ...markedDates };

      // If unmarking a past date, mark it as missed (orange)
      // If unmarking a future/current date, remove the marking completely
      if (new Date(date) < new Date()) {
        newMarkedDates[date] = {
          selected: true,
          selectedColor: "#f97316",
        };
      } else {
        delete newMarkedDates[date];
      }
      setMarkedDates(newMarkedDates);
    } else {
      // If date wasn't completed, mark it as completed (green)
      onMarkHabitDone(user.uid, habitFromRoute.id, date);
      setMarkedDates({
        ...markedDates,
        [date]: {
          selected: true,
          selectedColor: "#059669",
        },
      });
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    const completedDates = Object.keys(markedDates).filter(
      (date) => markedDates[date].selectedColor === "#059669"
    ).length;

    const startDate = new Date(habitFromRoute.startDate);
    const today = new Date();
    const endDate = new Date(habitFromRoute.endDate);
    const currentEndDate = today < endDate ? today : endDate;

    const totalDays =
      Math.floor((currentEndDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return (completedDates / totalDays) * 100;
  };

  // Add this function after calculateProgress
  const calculateLongestStreak = () => {
    const completedDates = Object.keys(markedDates)
      .filter(date => markedDates[date].selectedColor === '#059669')
      .sort();
    
    // Handle edge case of no completed dates
    if (completedDates.length === 0) {
      return 0;
    }
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < completedDates.length; i++) {
      // Use date strings directly for comparison instead of creating Date objects
      const currentDateStr = completedDates[i];
      const prevDateStr = completedDates[i - 1];
      
      // Calculate difference using a more efficient method
      const currentDate = new Date(currentDateStr);
      const prevDate = new Date(prevDateStr);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Track Your Habit</Text>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{habitFromRoute.name}</Text>
        <Text style={styles.habitFrequency}>
          Frequency: {habitFromRoute.frequency}
        </Text>

        {/* Add Start and End Date */}
        <Text style={styles.habitDates}>
          Start Date: {new Date(habitFromRoute.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.habitDates}>
          End Date: {new Date(habitFromRoute.endDate).toLocaleDateString()}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${calculateProgress()}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {`${Math.round(calculateProgress())}% Complete`}
          </Text>
        </View>

        <Text style={styles.habitProgress}>
          Completed:{" "}
          {
            Object.keys(markedDates).filter(
              (date) => markedDates[date].selectedColor === "#059669"
            ).length
          }{" "}
          times
        </Text>
        
        {/* Add Longest Streak */}
        <Text style={styles.habitStreak}>
          Longest Streak: {calculateLongestStreak()} days
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          minDate={habitFromRoute.startDate}
          maxDate={habitFromRoute.endDate}
          markedDates={markedDates}
          onDayPress={handleDateSelect}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#1f2937",
            selectedDayBackgroundColor: "#059669",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#3b82f6",
            dayTextColor: "#1f2937",
            textDisabledColor: "#d1d5db",
            arrowColor: "#3b82f6",
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1f2937",
  },
  habitInfo: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1f2937",
  },
  habitFrequency: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  habitDates: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  habitProgress: {
    fontSize: 14,
    color: "#6b7280",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 20,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
    textAlign: "center",
  },
});
