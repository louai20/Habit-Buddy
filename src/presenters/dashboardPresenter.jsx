// Presenter: HabitsPresenter.js
import { connect } from "react-redux";
import { DashboardView} from "../views/dashboardView";
import { fetchHabits } from "../models/habitsSlice";
import { useEffect } from "react";
import {Text} from "react-native";

const mapStateToProps = (state) => ({
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onFetchHabits: (userId) => dispatch(fetchHabits(userId)),
});

const DashboardPresenter = ({ user, onFetchHabits, habits, loading, error }) => {
  useEffect(() => {
    if (user?.uid) {
      onFetchHabits(user.uid); // Fetch habits if user ID is available
    }
  }, [user]); 

  // Check if user is logged in
  if (!user?.uid) {
    return <Text>Please log in to see your habits</Text>;
  }

  // Return the HabitsView component with the necessary props
  return <DashboardView habits={habits} loading={loading} error={error} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPresenter);

