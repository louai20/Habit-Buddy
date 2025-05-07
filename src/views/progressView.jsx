import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

const ProgressView = ({ habits, dailyCompletion, dayLabels }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📈 Your Progress</Text>

      <Text style={styles.stat}>Total Habits: {habits.length}</Text>
      <Text style={styles.stat}>
        Habits Completed Today:{" "}
        {habits.filter((habit) =>
          (habit.completedDates || []).includes(
            new Date().toISOString().split("T")[0]
          )
        ).length}
      </Text>

      <Text style={styles.chartTitle}>Completions in the Last 7 Days</Text>
      <BarChart
        data={{
          labels: dayLabels,
          datasets: [{ data: dailyCompletion }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        fromZero
        yAxisLabel=""
        segments={4}
        showValuesOnTopOfBars={true}
        withInnerLines={false}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
          labelColor: () => "#555",
        }}
        style={{ marginTop: 10, borderRadius: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stat: {
    fontSize: 16,
    marginBottom: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ProgressView;