import { useAuthStore } from "src/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

// PublicRoute.jsx
export default function PublicRoute() {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  return !user ? <Outlet /> : <Navigate to="/today" replace />;
}
