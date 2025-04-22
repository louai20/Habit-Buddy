import { connect } from "react-redux";
import { updateHabit, deleteHabit } from "../models/habitsSlice";
import { EditHabitView } from "../views/editHabitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateHabit: (userId, habitId, habitData) => dispatch(updateHabit(userId, habitId, habitData)),
  onDeleteHabit: (userid, habitId) => dispatch(deleteHabit(userid, habitId)),
});

const EditHabitPresenter = ({ user, habits, onUpdateHabit, onDeleteHabit }) => {

  // Check if user is logged in
  if (!user?.uid) {
    return <UnauthorizedView />
  }

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