import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../pages/Authentication/SignIn/SignIn";

import Settings from "../pages/Settings/Settings";
import Accounts from "../pages/Accounts/Accounts";
import Profile from "../pages/Profile/Profile";
import Organization from "../pages/Organization/Organization";
import SettingsPermissions from "../pages/Settings/SettingsPermissions";
import SettingsTeams from "../pages/Settings/SettingsTeams";
import SettingsUsers from "../pages/Settings/SettingsUsers";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes.config";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
    <Route path={ROUTES.MAIN.ROOT} element={<ProtectedRoute />}>
      <Route path={ROUTES.MAIN.ROOT} element={<Organization />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/settings" element={<Settings />}>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<SettingsUsers />} />
        <Route path="teams" element={<SettingsTeams />} />
        <Route path="permissions" element={<SettingsPermissions />} />
      </Route>
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
);
