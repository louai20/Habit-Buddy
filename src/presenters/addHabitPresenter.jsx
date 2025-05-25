import { connect } from "react-redux";
import { addHabit } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.habits.loading,
  error: state.habits.error
});

const mapDispatchToProps = (dispatch) => ({
  onAddHabit: (habitData) => dispatch(addHabit(habitData)),
});

const AddHabitPresenter = ({ user, onAddHabit, loading, error }) => {
  if (!user?.uid) {
    return <UnauthorizedView />
  }
  return <AddHabitView user={user} onAddHabit={onAddHabit} loading={loading} error={error} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

