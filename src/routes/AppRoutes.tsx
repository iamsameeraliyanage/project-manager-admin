import { useRoutes } from "react-router-dom";
import SignIn from "../pages/authentication/sign-in/SignIn";

import Settings from "../pages/organization/Settings";
import Accounts from "../pages/organization/Accounts";
import Profile from "../pages/organization/Profile";
import Organization from "../pages/organization/Organization";
import AuthnticatedRoute from "./AuthnticatedRoute";

export const AppRoutes = () =>
  useRoutes([
    { path: "/signin", element: <SignIn /> },
    {
      path: "/",
      element: <AuthnticatedRoute />,
      children: [
        { path: "/", element: <Organization /> },
        { path: "/accounts", element: <Accounts /> },
        { path: "/settings", element: <Settings /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]);
