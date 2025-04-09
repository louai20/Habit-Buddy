// Presenter: HabitsPresenter.js
import { connect } from "react-redux";
import { HabitsView } from "../views/habitsView";
import { fetchHabits, setHabit, increment, decrement } from "../models/habitsSlice";
import { useEffect } from "react";

const mapStateToProps = (state) => ({
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onFetchHabits: (userId) => dispatch(fetchHabits(userId)),
});

const HabitsPresenter = ({ user, onFetchHabits, habits, loading, error }) => {
  console.log("rendering habits presenter with user", user);
  useEffect(() => {
    if (user?.uid) {
      onFetchHabits(user.uid); // Fetch habits if user ID is available
    }
  }, [user]); 

  // Check if user is logged in
  if (!user?.uid) {
    return <p>Please log in to see your habits</p>;
  }

  // Return the HabitsView component with the necessary props
  return <HabitsView habits={habits} loading={loading} error={error} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitsPresenter);

