import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import GithubLogin from '../Login/GithubLogin';
import HabitTracker from '../HabitTracker/HabitTracker';
import { formatData } from './helper';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const checkDataValid = (data, today) => {
    if (data) {
      const records = data[0].records;
      const lastDate = records[records.length - 1].created_on;
      return today === lastDate;
    }
    return false;
  };

  const fetchHabits = (today) => {
    supabase.functions
      .invoke(`fetch-habits?endDate=${today}`, { method: 'GET' })
      .then((res) => {
        const fetchedHabits = res.data.data;
        const formattedHabits = formatData(fetchedHabits, today);
        const JSONHabits = JSON.stringify(formattedHabits);
        setHabits(formattedHabits);
        sessionStorage.setItem('habits', JSONHabits);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // check session storage
    const today = new Date().toISOString().split('T')[0];
    const storedHabits = sessionStorage.getItem('habits');
    const parsedHabits = JSON.parse(storedHabits);
    const dataValid = checkDataValid(parsedHabits, today);
    if (dataValid) {
      // grab session storage data
      setHabits(parsedHabits);
    } else {
      // get data from supabase
      fetchHabits(today);
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
          <div id="habits-container">
            {habits.map((habit, index) => (
              <HabitTracker
                key={index}
                title={habit.title}
                records={habit.records}
                rgbColor={habit.rgbColor}
              />
            ))}
          </div>
        </>
      ) : (
        <GithubLogin />
      )}
    </div>
  );
}
