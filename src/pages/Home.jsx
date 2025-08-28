import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';
import 'src/styles/Home.css';

export default function Home() {
  const { habits, signOut, fetchHabits } = useContext(AppContext);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut().then(() => navigate('/login'));
  };

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return (
    <>
      <h1>Habit Tracker</h1>
      <button onClick={() => navigate('/profile')}>Go to Profile</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <div id="habits-container">
        {habits &&
          habits.map((habit, index) => (
            <div
              key={index}
              className="clickable"
              onClick={() => navigate('/habit?habit_id=' + habit.id)}
            >
              <HabitContextProvider habit={habit}>
                <HabitTracker />
              </HabitContextProvider>
            </div>
          ))}
      </div>
    </>
  );
}
