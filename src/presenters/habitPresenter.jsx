import { connect } from "react-redux";
import { updateHabit, deleteHabit, habitActionSuccess, habitActionError } from "../models/habitsSlice";
import { HabitView } from "../views/habitView";
import { UnauthorizedView } from "../views/unauthorizedView";
import { habitService } from "../services/habitService";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateHabit: ({ habitId, updatedData }) => dispatch(updateHabit({ habitId, updatedData })),
  onDeleteHabit: (habitId) => dispatch(deleteHabit(habitId)),
  onHabitActionSuccess: () => dispatch(habitActionSuccess()),
  onHabitActionError: (error) => dispatch(habitActionError(error)),
});

const HabitPresenter = ({ user, habits, loading, error, onUpdateHabit, onDeleteHabit, onHabitActionSuccess, onHabitActionError }) => {

  const handleUpdateHabit = async ({ habitId, updatedData }) => {
    try {
      onUpdateHabit({ habitId, updatedData });
      await habitService.updateHabit(user.uid, habitId, updatedData);
      onHabitActionSuccess();
    } catch (error) {
      onHabitActionError(error.message);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      onDeleteHabit(habitId);
      await habitService.deleteHabit(user.uid, habitId);
      onHabitActionSuccess();
    } catch (error) {
      onHabitActionError(error.message);
    }
  };

  if (!user?.uid) {
    return <UnauthorizedView />;
  }

  return (
    <HabitView 
      user={user} 
      habits={habits} 
      loading={loading} 
      error={error} 
      onUpdateHabit={handleUpdateHabit} 
      onDeleteHabit={handleDeleteHabit} 
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitPresenter);