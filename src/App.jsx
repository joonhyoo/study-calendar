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
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/habit" element={<PrivateRoute element={<Habit />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
