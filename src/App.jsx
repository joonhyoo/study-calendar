import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'src/styles/App.css';
import supabase from 'src/utils/supabase';
import Home from 'src/pages/Home';
import Profile from 'src/pages/Profile';
import Habit from 'src/pages/Habit';
import GithubLogin from 'src/components/Login/GithubLogin';

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
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <GithubLogin />}
      />
      <Route path="/home" element={<Home user={user} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="/habit" element={<Habit />} />
    </Routes>
  );
}

export default App;
