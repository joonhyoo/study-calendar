import { useEffect } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "src/stores/authStore";

function PublicRoute() {
  const navigate = useNavigate();
  const { user, verifyUser, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = user ?? (await verifyUser());
      if (currentUser) {
        navigate("/");
      }
    };
    checkAuth();
  }, [user, navigate, verifyUser]);

  if (isLoading) return <p>Loading...</p>; // or a spinner

  return user ? <Navigate to="/home" replace /> : <Outlet />;
}
export default PublicRoute;
