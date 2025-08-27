import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Home from 'src/pages/Home';
import Profile from 'src/pages/Profile';
import Habit from 'src/pages/Habit';
import GithubLogin from 'src/components/Login/GithubLogin';
import 'src/styles/App.css';
import PrivateRoute from './utils/PrivateRoute';
import AppContext from './contexts/AppContextProvider';

function App() {
  const { user } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === '/login') navigate('/home');
  }, [user, location, navigate]);

  return (
    <Routes>
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/login" element={<GithubLogin />} />
      <Route path="/habit" element={<PrivateRoute element={<Habit />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
