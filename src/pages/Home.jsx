import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import GithubLogin from '../Login/GithubLogin';
import HabitTracker from '../HabitTracker/HabitTracker';

export default function Home({ user }) {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // check session storage
    const storedRecords = sessionStorage.getItem('records');
    // if exists => pull that data
    if (storedRecords) {
      setRecords(storedRecords);
    } else {
      // else fetches session storage records
      supabase.functions
        .invoke('fetch-study-records')
        .then((res) => setRecords(res.data.sortedList))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div id="main-container">
      <h1 className="white-text">Habit Tracker</h1>
      {user ? (
        <>
          <p>You are logged in as {user.email}</p>
          <button onClick={() => navigate('/profile')}>Go to Profile</button>
          <button onClick={signOut}>Sign Out</button>
          <HabitTracker title={'Japanese Study'} records={records} />
        </>
      ) : (
        <GithubLogin />
      )}
    </div>
  );
}
