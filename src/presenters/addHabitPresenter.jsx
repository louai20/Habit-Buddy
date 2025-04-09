import { connect } from "react-redux";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";
import { AddHabitView } from "../views/addHabitView";

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

const AddHabitPresenter = (props) => {
 
  return <AddHabitView {...props} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHabitPresenter);

