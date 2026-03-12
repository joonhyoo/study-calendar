import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "src/pages/Dashboard";
import Profile from "src/pages/Profile";
import Today from "src/pages/Today";
import HabitSettings from "src/pages/HabitSettings";
import Login from "src/pages/Login";
import PrivateRoute from "src/utils/PrivateRoute";
import PublicRoute from "src/utils/PublicRoute";
import Homepage from "src/pages/Homepage";
import PrivacyPolicy from "src/pages/PrivacyPolicy";
import { useAuthStore } from "src/stores/authStore";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe; // cleanup on unmount
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="today" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="today" element={<Today />} />
          <Route path="progress" element={<div>Coming Soon</div>} />
          <Route
            path="manage"
            element={<div>Patching things up</div> /*<HabitSettings />*/}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
