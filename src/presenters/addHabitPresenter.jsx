import { connect } from "react-redux";
import { fetchHabits, setHabit } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onSetHabit: (habitData, userId) => dispatch(setHabit({ habitData, userId })),
});

const AddHabitPresenter = ({ user, onSetHabit }) => {
  return <AddHabitView user={user} onSetHabit={onSetHabit} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

