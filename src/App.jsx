import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/App.css';
import supabase from './utils/supabase';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route
        path="/profile"
        element={user ? <Profile user={user} /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
