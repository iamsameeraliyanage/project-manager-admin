import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../pages/Authentication/SignIn/SignIn";

import Settings from "../pages/Settings/Settings";
import Accounts from "../pages/Accounts/Accounts";
import Profile from "../pages/Profile/Profile";
import Organization from "../pages/Organization/Organization";
// import UserDetail from "../pages/UserDetail/UserDetail";
import UserHome from "../pages/UserHome/UserHome";
import TimeLogger from "../pages/TimeLogger/TimeLogger";
import CustomerProjects from "../pages/CustomerProjects/CustomerProjects";
import ProtectedRoute from "./ProtectedRoute";
import SettingsPermissions from "../pages/Settings/SettingsPermissions";
import SettingsTeams from "../pages/Settings/SettingsTeams";
import SettingsUsers from "../pages/Settings/SettingsUsers";
import InternalProjects from "../pages/InternalProjects/InternalProjects";
import Break from "../pages/Break/Break";
import SignOff from "../pages/SignOff/SignOff";
import Calendar from "../pages/Calendar/Calendar";
import CalendarView from "../pages/Calendar/CalendarView";
import VacationRequest from "../pages/Calendar/VacationRequest";
import VacationRequestForm from "../pages/Calendar/VacationRequestForm";
import TimeReport from "../pages/Calendar/TimeReport";
import Gallery from "../pages/Gallery/Gallery";
import Dashboard from "../pages/Dashboard/Dashboard";
import { ROUTES } from "./routes.config";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
    <Route path={ROUTES.MAIN.ROOT} element={<ProtectedRoute />}>
      <Route path={ROUTES.MAIN.ROOT} element={<Organization />} />
      <Route path={ROUTES.USER.USER_ID} element={<UserHome />} />
      <Route
        path={`${ROUTES.USER.USER_ID}/${ROUTES.USER.TIME_LOGGER}`}
        element={<TimeLogger />}
      />
      <Route
        path={`${ROUTES.USER.USER_ID}/${ROUTES.USER.CUSTOMER_PROJECTS}`}
        element={<CustomerProjects />}
      />
      <Route path="/:userId/break" element={<Break />} />
      <Route path="/:userId/sign-off" element={<SignOff />} />
      <Route path="/:userId/calendar" element={<Calendar />} />
      <Route path="/:userId/calendar/view" element={<CalendarView />} />
      <Route
        path="/:userId/calendar/vacation-request"
        element={<VacationRequest />}
      />
      <Route
        path="/:userId/calendar/vacation-request/create"
        element={<VacationRequestForm />}
      />
      <Route path="/:userId/calendar/time-report" element={<TimeReport />} />
      {/* <Route path="/:userId" element={<UserDetail />} /> */}
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/settings" element={<Settings />}>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<SettingsUsers />} />
        <Route path="teams" element={<SettingsTeams />} />
        <Route path="permissions" element={<SettingsPermissions />} />
      </Route>
      <Route path="/profile" element={<Profile />} />
      <Route path={`/${ROUTES.MAIN.GALLERY}`} element={<Gallery />} />
      <Route path={`/${ROUTES.MAIN.DASHBOARD}`} element={<Dashboard />} />
      <Route
        path={`${ROUTES.USER.USER_ID}/${ROUTES.USER.INTERNAL_PROJECTS}/${ROUTES.USER.TASK_ID}`}
        element={<InternalProjects />}
      />
    </Route>
  </Routes>
);
