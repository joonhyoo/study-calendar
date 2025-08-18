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

  const checkDataValid = (data, today) => {
    if (data) {
      const lastDate = data[data.length - 1].created_on;
      return today === lastDate;
    }
    return false;
  };

  const fetchData = (today) => {
    console.log('evoked');
    supabase.functions
      .invoke(`fetch-records?endDate=${today}`, { method: 'GET' })
      .then((res) => {
        const fetchedData = res.data.sortedList;
        setRecords(fetchedData);
        console.log(fetchedData);
        const jsonData = JSON.stringify(fetchedData);
        sessionStorage.setItem('records', jsonData);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // check session storage
    const today = new Date().toISOString().split('T')[0];
    const storedRecords = sessionStorage.getItem('records');
    const parsedData = JSON.parse(storedRecords);
    const dataValid = checkDataValid(parsedData, today);
    // if exists => pull that data
    if (dataValid) {
      setRecords(parsedData);
    } else {
      // else fetches session storage records
      fetchData(today);
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
