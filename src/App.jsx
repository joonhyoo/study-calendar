import { Navigate, Route, Routes } from "react-router-dom";
import Habit from "src/pages/Habit";
import Home from "src/pages/Home";
import Profile from "src/pages/Profile";
import HabitSettings from "./pages/HabitSettings";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Navigate to="/login" replace />} />
			<Route element={<PrivateRoute />}>
				<Route path="/home" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/habit" element={<Habit />} />
				<Route path="/settings" element={<HabitSettings />} />
			</Route>
		</Routes>
	);
}

export default App;
