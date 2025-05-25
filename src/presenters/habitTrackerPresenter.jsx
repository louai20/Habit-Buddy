import { connect } from "react-redux";
import { HabitTrackerView } from "../views/habitTrackerView";
import { UnauthorizedView } from "../views/unauthorizedView";
import { markHabitAsDone, unmarkHabitAsDone } from "../models/habitsSlice";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onMarkHabitDone: (userId, habitId, date) => dispatch(markHabitAsDone({ habitId, date })),
  onUnmarkHabitDone: (userId, habitId, date) => dispatch(unmarkHabitAsDone({ habitId, date }))
});

const HabitTrackerPresenter = ({ user, habits, loading, error, onMarkHabitDone, onUnmarkHabitDone }) => {
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  return (
    <HabitTrackerView
      user={user}
      habits={habits}
      loading={loading}
      error={error}
      onMarkHabitDone={onMarkHabitDone}
      onUnmarkHabitDone={onUnmarkHabitDone}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitTrackerPresenter);