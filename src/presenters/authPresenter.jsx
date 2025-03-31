import { connect } from "react-redux";
import { AuthView } from "../views/authView";
import { loginWithGoogle, logout } from "../models/authSlice";

const AuthPresenter = ({ user, loading, error, onLoginWithGoogle, onLogout }) => {
  return (
    <AuthView
      user={user}
      loading={loading}
      error={error}
      onLoginWithGoogle={onLoginWithGoogle}
      onLogout={onLogout}
    />
  );
};

// Mapping Redux state to component props
const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
});

// Mapping Redux dispatch actions to component props
const mapDispatchToProps = (dispatch) => ({
  onLoginWithGoogle: () => dispatch(loginWithGoogle()),
  onLogout: () => dispatch(logout()),
});

// Connecting the presenter to Redux
export default connect(mapStateToProps, mapDispatchToProps)(AuthPresenter);
//export default connect(mapStateToProps, mapDispatchToProps)(AuthView);
//However, this violates the MVP pattern because it makes AuthView aware of Redux, 
// which couples the View to the Model (Redux state directly).