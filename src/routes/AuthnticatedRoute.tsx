import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "../widgets/LayoutWidgets/MainLayout/MainLayout";

const AuthnticatedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default AuthnticatedRoute;
