import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

export const ProgressView = ({ habits, dayLabels, dailyCompletion, loading, error }) => {


  const today = new Date().toISOString().split("T")[0];

  // turn all values into numbers
  const numbers = dailyCompletion.map(Number);
  // find the max, defaulting to at least 1 so we always get a y-axis
  const maxCompletion = Math.max(...numbers, 1);
  // ensure at least two segments so we get both 0 and 1 labeled
  const segments = Math.max(maxCompletion, 2);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📈 Your Progress</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Habits Completed Today</Text>
        <Text style={styles.cardValue}>
          {habits.filter((h) => h.completedDates?.includes(today)).length}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Habits</Text>
        <Text style={styles.cardValue}>{habits.length}</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Completions</Text>
        <LineChart
          data={{
            labels: dayLabels,
            datasets: [{ data: numbers }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          fromZero                    // start Y-axis at zero
          segments={segments}         
          yAxisInterval={1}           // label every integer
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
            labelColor: () => "#555",
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#3f51b5",
            },
          }}
          bezier
          style={{ marginTop: 10, borderRadius: 10 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: "#555",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
});

export default ProgressView;