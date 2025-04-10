import { connect } from "react-redux";
import { updateHabit, deleteHabit } from "../models/habitsSlice";
import { EditHabitView } from "../views/editHabitView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateHabit: (habitId, habitData) => dispatch(updateHabit({ habitId, habitData })),
  onDeleteHabit: (userid, habitId) => dispatch(deleteHabit(userid, habitId)),
});

const EditHabitPresenter = ({ user, habits, onUpdateHabit, onDeleteHabit }) => {
  return (
    <EditHabitView
      user={user}
      habits={habits}
      onUpdateHabit={onUpdateHabit}
      onDeleteHabit={onDeleteHabit}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHabitPresenter); 