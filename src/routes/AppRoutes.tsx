import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/Authentication/SignIn/SignIn";
import Organization from "../pages/Organization/Organization";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes.config";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
    <Route path={ROUTES.MAIN.ROOT} element={<ProtectedRoute />}>
      <Route path={ROUTES.MAIN.ROOT} element={<Organization />} />
    </Route>
  </Routes>
);
