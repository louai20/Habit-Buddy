import { connect } from "react-redux";
import { setHabit } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onSetHabit: (habitData, userId) => dispatch(setHabit({ habitData, userId })),
});

const AddHabitPresenter = ({ user, onSetHabit }) => {
  if (!user?.uid) {
    return <UnauthorizedView />
  }
  return <AddHabitView user={user} onSetHabit={onSetHabit} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

