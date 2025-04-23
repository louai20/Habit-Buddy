import { connect } from "react-redux";
import { updateHabit, deleteHabit } from "../models/habitsSlice";
import { HabitView } from "../views/habitView";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateHabit: (userId, habitId, habitData) => dispatch(updateHabit(userId, habitId, habitData)),
  onDeleteHabit: (userid, habitId) => dispatch(deleteHabit(userid, habitId)),
});

const HabitPresenter = ({ user, habits, onUpdateHabit, onDeleteHabit }) => {

  // Check if user is logged in
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  return (
    <HabitView
      user={user}
      habits={habits}
      onDeleteHabit={onDeleteHabit}

    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitPresenter); 