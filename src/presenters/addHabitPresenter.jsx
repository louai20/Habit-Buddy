import { connect } from "react-redux";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";

const mapStateToProps = (state) => ({
  value: state.habits.value,
  loading: state.habits.loading,
  error: state.habits.error,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchHabits: () => dispatch(fetchHabits()),
  onSetHabit: (value) => dispatch(setHabit({ id: "habit_" + Date.now(), habitData: { value } })),
  onIncrement: () => dispatch(increment()),
  onDecrement: () => dispatch(decrement()),
});

const AddHabitPresenter = (props) => {
 
  return <AddHabitView {...props} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

