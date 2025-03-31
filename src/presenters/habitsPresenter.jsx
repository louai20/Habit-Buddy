// Presenter: HabitsPresenter.js
import { connect } from "react-redux";
import { HabitsView } from "../views/habitsView";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";

const mapStateToProps = (state) => ({
  value: state.habits.value,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchHabits: () => dispatch(fetchHabits()),
  onSetHabit: (value) => dispatch(setHabit({ id: "habit_" + Date.now(), habitData: { value } })),
  onIncrement: () => dispatch(increment()),
  onDecrement: () => dispatch(decrement()),
});

const HabitsPresenter = (props) => {
  return <HabitsView {...props} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitsPresenter);

