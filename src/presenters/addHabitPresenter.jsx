import { connect } from "react-redux";
import { setHabit } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";
import {Text} from "react-native";

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onSetHabit: (habitData, userId) => dispatch(setHabit({ habitData, userId })),
});

const AddHabitPresenter = ({ user, onSetHabit }) => {
  if (!user?.uid) {
    return <Text>Please log in to add habits</Text>;
  }
  return <AddHabitView user={user} onSetHabit={onSetHabit} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

