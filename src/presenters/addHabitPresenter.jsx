import { connect } from "react-redux";
import { addHabit, habitActionSuccess, habitActionError } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onAddHabit: (habitData) => dispatch(addHabit(habitData)),
  onHabitActionSuccess: () => dispatch(habitActionSuccess()),
  onHabitActionError: (error) => dispatch(habitActionError(error)),
});

const AddHabitPresenter = ({ user, onAddHabit, onHabitActionSuccess, onHabitActionError, loading, error }) => {
  
  // Async function for adding habit
  const handleAddHabit = async (habitData) => {
    try {
      onAddHabit(habitData); // This will trigger the middleware
      // The middleware will handle Firebase sync and call success/error actions
    } catch (error) {
      onHabitActionError(error.message);
    }
  };
  
  if (!user?.uid) {
    return <UnauthorizedView />;
  }

  return (
    <AddHabitView 
      user={user} 
      onAddHabit={handleAddHabit} 
      loading={loading} 
      error={error} 
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

