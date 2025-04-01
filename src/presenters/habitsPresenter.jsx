// Presenter: HabitsPresenter.js
import { connect } from "react-redux";
import { HabitsView } from "../views/habitsView";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";
import { useEffect } from "react";
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

const HabitsPresenter = (props) => {
  // Fetch habits once when the app starts could be done in the store or somewhere else
  useEffect(() => {
    props.onFetchHabits(); // Dispatch the fetchHabits action to load the habits data
  }, []);
  return <HabitsView {...props} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitsPresenter);

