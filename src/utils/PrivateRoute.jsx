import { useAuthStore } from "src/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null; // or a spinner — don't redirect yet!
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
