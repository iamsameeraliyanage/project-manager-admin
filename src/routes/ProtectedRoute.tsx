import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "../widgets/LayoutWidgets/MainLayout/MainLayout";
import useAuthUser from "../hooks/api/use-auth-user";
import FullPageLoader from "../widgets/FullPageLoader/FullPageLoader";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useAuthUser();
  if (isLoading) {
    return <FullPageLoader />;
  }

  return user ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
