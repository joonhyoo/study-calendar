import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Habit from "src/pages/Habit";
import Home from "src/pages/Home";
import Profile from "src/pages/Profile";
import Today from "src/pages/Today";
import HabitSettings from "./pages/HabitSettings";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />}>
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
