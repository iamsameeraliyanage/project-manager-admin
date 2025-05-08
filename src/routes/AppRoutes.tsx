import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import SignIn from "../pages/authentication/sign-in/SignIn";

import Settings from "../pages/organization/Settings/Settings";
import Accounts from "../pages/organization/Accounts";
import Profile from "../pages/organization/Profile";
import Organization from "../pages/organization/Organization";
import AuthnticatedRoute from "./AuthnticatedRoute";
import SettingsPermissions from "../pages/organization/Settings/SettingsPermissions";
import SettingsTeams from "../pages/organization/Settings/SettingsTeams";
import SettingsUsers from "../pages/organization/Settings/SettingsUsers";

export const AppRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/" element={<AuthnticatedRoute />}>
      <Route path="/" element={<Organization />} />
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
