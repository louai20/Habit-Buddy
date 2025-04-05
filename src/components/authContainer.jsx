import { useDispatch, useSelector } from "react-redux";
import { logout } from "../models/authSlice";
import AuthView from "../views/authView";

const AuthContainer = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthView
      user={user}
      loading={loading}
      error={error}
      onLogout={handleLogout}
    />
  );
};

export default AuthContainer;
