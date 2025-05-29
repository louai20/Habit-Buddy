import { connect } from "react-redux";
import { DashboardView} from "../views/dashboardView";
import { fetchHabitsStart, fetchHabitsSuccess, fetchHabitsError } from "../models/habitsSlice";
import { habitService } from "../services/habitService";
import { useEffect } from "react";
import { UnauthorizedView } from "../views/unauthorizedView";

const mapStateToProps = (state) => ({
  habits: state.habits.habits,
  loading: state.habits.loading,
  error: state.habits.error,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  onFetchHabitsStart: () => dispatch(fetchHabitsStart()),
  onFetchHabitsSuccess: (data) => dispatch(fetchHabitsSuccess(data)),
  onFetchHabitsError: (error) => dispatch(fetchHabitsError(error)),
});

const DashboardPresenter = ({ 
  user, 
  onFetchHabitsStart, 
  onFetchHabitsSuccess, 
  onFetchHabitsError, 
  habits, 
  loading, 
  error 
}) => {
  
  // Async function in presenter
  const fetchHabits = async (userId) => {
    try {
      onFetchHabitsStart();
      const data = await habitService.fetchHabits(userId);
      onFetchHabitsSuccess(data);
      return data;
    } catch (error) {
      onFetchHabitsError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchHabits(user.uid);
    }
  }, [user]); 

  // Check if user is logged in
  if (!user?.uid) {
    return <UnauthorizedView />
  }

  // Return the DashboardView component with the necessary props
  return <DashboardView habits={habits} loading={loading} error={error} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPresenter);

