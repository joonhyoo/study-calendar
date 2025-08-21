import supabase from 'src/utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'src/styles/Home.css';
import { HabitContext } from 'src/contexts/contexts';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';

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
        const fetchedHabits = res.data.formattedData;
        const JSONHabits = JSON.stringify(fetchedHabits);
        setHabits(fetchedHabits);
        sessionStorage.setItem('habits', JSONHabits);
      })
      .catch((err) => console.log(err));
  };

  const getLocalToday = () => {
    const today = new Date();
    const currYear = today.getFullYear();
    const currMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currDate = String(today.getDate()).padStart(2, '0');
    return currYear + '-' + currMonth + '-' + currDate;
  };

  useEffect(() => {
    // check session storage
    const today = getLocalToday();
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
      <p className="white-text">You are logged in as {user.email}</p>
      <button onClick={() => navigate('/profile')}>Go to Profile</button>
      <button onClick={signOut}>Sign Out</button>
      <div id="habits-container">
        {habits.map((habit, index) => (
          <HabitContext value={habit} key={index}>
            <HabitTracker />
          </HabitContext>
        ))}
      </div>
    </div>
  );
}
