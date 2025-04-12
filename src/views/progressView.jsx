import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { BarChart } from "react-native-chart-kit";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const habits = useSelector((state) => state.habits.habits);

  // completed count for each of the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "yyyy-MM-dd")
  );
  const dayLabels = last7Days.map((d) => format(new Date(d), "EEE"));

  const dailyCompletion = last7Days.map((date) =>
    habits.filter((h) => h.completedDates?.includes(date)).length
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📈 Your Progress</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Habits Completed Today</Text>
        <Text style={styles.cardValue}>
          {
            habits.filter((h) =>
              h.completedDates?.includes(new Date().toISOString().split("T")[0])
            ).length
          }
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Habits</Text>
        <Text style={styles.cardValue}>{habits.length}</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Completions</Text>
        <BarChart
          data={{
            labels: dayLabels,
            datasets: [{ data: dailyCompletion }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          fromZero
          yAxisLabel=""
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export default Dashboard;
