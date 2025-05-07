import React from "react";
import { useSelector } from "react-redux";
import ProgressView from "../views/progressView";

const ProgressPresenter = () => {
  
  const habits = useSelector((state) => state.habits.habits);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dayLabels = last7Days.map((date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" })
  );

  let dailyCompletion = last7Days.map((date) => {
    const uniqueHabitCompletions = new Set();
    habits.forEach((habit) => {
      const uniqueDates = [...new Set(habit.completedDates || [])];
      if (uniqueDates.includes(date)) {
        uniqueHabitCompletions.add(habit.id);
      }
    });
    return Math.min(uniqueHabitCompletions.size, 4); // Clamp
  });
     
  return (
    <ProgressView
      habits={habits}
      dailyCompletion={dailyCompletion}
      dayLabels={dayLabels}
    />
  );
};

export default ProgressPresenter;