import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import SignIn from "../pages/authentication/sign-in/SignIn";

import Settings from "../pages/organization/Settings";
import Accounts from "../pages/organization/Accounts";
import Profile from "../pages/organization/Profile";
import Organization from "../pages/organization/Organization";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export const AppRoutes = () =>
  useRoutes([
    { path: "/signin", element: <SignIn /> },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "", element: <Organization /> },
        { path: "settings", element: <Settings /> },
        { path: "accounts", element: <Accounts /> },
        { path: "profile", element: <Profile /> },
      ],
    },
  ]);
