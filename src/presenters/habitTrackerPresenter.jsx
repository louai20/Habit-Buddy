import { connect } from "react-redux";
import { markHabitAsDone, unmarkHabitAsDone, habitActionSuccess, habitActionError } from "../models/habitsSlice";
import { HabitTrackerView } from "../views/habitTrackerView";
import { UnauthorizedView } from "../views/unauthorizedView";
import { habitService } from "../services/habitService";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onMarkHabitDone: (habitId, date) => dispatch(markHabitAsDone({ habitId, date })),
  onUnmarkHabitDone: (habitId, date) => dispatch(unmarkHabitAsDone({ habitId, date })),
  onHabitActionSuccess: () => dispatch(habitActionSuccess()),
  onHabitActionError: (error) => dispatch(habitActionError(error)),
});

const HabitTrackerPresenter = ({ user, habits, loading, error, onMarkHabitDone, onUnmarkHabitDone, onHabitActionSuccess, onHabitActionError }) => {

  const handleMarkHabitDone = async (habitId, date) => {
    try {
      onMarkHabitDone(habitId, date);
      await habitService.markHabitAsDone(user.uid, habitId, date);
      onHabitActionSuccess();
    } catch (error) {
      onHabitActionError(error.message);
    }
  };

  const handleUnmarkHabitDone = async (habitId, date) => {
    try {
      onUnmarkHabitDone(habitId, date);
      await habitService.unmarkHabitAsDone(user.uid, habitId, date);
      onHabitActionSuccess();
    } catch (error) {
      onHabitActionError(error.message);
    }
  };

  if (!user?.uid) {
    return <UnauthorizedView />;
  }

  return (
    <HabitTrackerView 
      user={user} 
      habits={habits} 
      loading={loading} 
      error={error} 
      onMarkHabitDone={handleMarkHabitDone} 
      onUnmarkHabitDone={handleUnmarkHabitDone} 
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitTrackerPresenter);