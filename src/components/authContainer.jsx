import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, logout } from "../models/authSlice";
import AuthView from "../views/authView";

const AuthContainer = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLoginWithGoogle = () => {
    dispatch(loginWithGoogle());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthView
      user={user}
      loading={loading}
      error={error}
      onLoginWithGoogle={handleLoginWithGoogle}
      onLogout={handleLogout}
    />
  );
};

export default AuthContainer;
