import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = () => {
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.interaction.isUserLoggedIn
  );

  if (!isLoggedIn) {
    return <Navigate to="/readonly-profile" replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;
