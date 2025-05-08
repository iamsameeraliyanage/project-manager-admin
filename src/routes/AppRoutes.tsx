import { Navigate, useRoutes } from "react-router-dom";
import SignIn from "../pages/authentication/sign-in/SignIn";

import Settings from "../pages/organization/Settings/Settings";
import Accounts from "../pages/organization/Accounts";
import Profile from "../pages/organization/Profile";
import Organization from "../pages/organization/Organization";
import AuthnticatedRoute from "./AuthnticatedRoute";
import SettingsPermissions from "../pages/organization/Settings/SettingsPermissions";
import SettingsTeams from "../pages/organization/Settings/SettingsTeams";
import SettingsUsers from "../pages/organization/Settings/SettingsUsers";

export const AppRoutes = () =>
  useRoutes([
    { path: "/signin", element: <SignIn /> },
    {
      path: "/",
      element: <AuthnticatedRoute />,
      children: [
        { path: "/", element: <Organization /> },
        { path: "/accounts", element: <Accounts /> },
        {
          path: "/settings",
          element: <Settings />,
          children: [
            { index: true, element: <Navigate to="users" replace /> },
            { path: "users", element: <SettingsUsers /> },
            { path: "teams", element: <SettingsTeams /> },
            { path: "permissions", element: <SettingsPermissions /> },
          ],
        },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]);
