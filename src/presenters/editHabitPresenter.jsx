import { connect } from "react-redux";
import { updateHabit, deleteHabit, habitActionError, habitActionSuccess } from "../models/habitsSlice";
import { EditHabitView } from "../views/editHabitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateHabit: ({ habitId, updatedData }) => dispatch(updateHabit({ habitId, updatedData })),
  onDeleteHabit: ({ userId, habitId }) => dispatch(deleteHabit(habitId)),
});

const EditHabitPresenter = ({ user, habits, loading, error, onUpdateHabit, onDeleteHabit }) => {
  // Check if user is logged in
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  return (
    <EditHabitView
      user={user}
      habits={habits}
      loading={loading}
      error={error}
      onUpdateHabit={onUpdateHabit}
      onDeleteHabit={onDeleteHabit}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHabitPresenter);