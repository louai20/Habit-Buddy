import { connect } from "react-redux";
import { ProgressView } from "../views/progressView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error
});

const ProgressPresenter = ({ user, habits, loading, error }) => {
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dayLabels = last7Days.map((date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" })
  );

  const dailyCompletion = last7Days.map((date) => {
    const uniqueHabitCompletions = new Set();
    habits.forEach((habit) => {
      const uniqueDates = [...new Set(habit.completedDates || [])];
      if (uniqueDates.includes(date)) {
        uniqueHabitCompletions.add(habit.id);
      }
    });
    return uniqueHabitCompletions.size;
  });

  return (
    <ProgressView
      habits={habits}
      dailyCompletion={dailyCompletion}
      dayLabels={dayLabels}
      loading={loading}
      error={error}
    />
  );
};

export default connect(mapStateToProps)(ProgressPresenter);