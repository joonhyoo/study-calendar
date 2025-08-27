import { Routes, Route, Navigate } from 'react-router-dom';
import Home from 'src/pages/Home';
import Profile from 'src/pages/Profile';
import Habit from 'src/pages/Habit';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
import 'src/styles/App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/habit" element={<Habit />} />
      </Route>
    </Routes>
  );
}

export default App;
