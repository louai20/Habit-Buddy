import { connect } from "react-redux";
import { HabitTrackerView } from "../views/habitTrackerView";
import { UnauthorizedView } from "../views/unauthorizedView";
import { markHabitAsDone, unmarkHabitAsDone } from "../models/habitsSlice";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits
});

const mapDispatchToProps = (dispatch) => ({
  onMarkHabitDone: (userId, habitId) => dispatch(markHabitAsDone({ userId, habitId })),
  onUnmarkHabitDone: (userId, habitId) => dispatch(unmarkHabitAsDone({ userId, habitId }))
});

const HabitTrackerPresenter = ({ user, habits, onMarkHabitDone, onUnmarkHabitDone }) => {
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  return (
    <HabitTrackerView
      user={user}
      habits={habits}
      onMarkHabitDone={onMarkHabitDone}
      onUnmarkHabitDone={onUnmarkHabitDone}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitTrackerPresenter);