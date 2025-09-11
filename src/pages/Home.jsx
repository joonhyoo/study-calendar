import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import HabitTracker from 'src/components/HabitTracker';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';

export default function Home() {
  const { habits, signOut, shuukanData, loadShuukanData } =
    useContext(AppContext);

  useEffect(() => {
    loadShuukanData();
  }, [loadShuukanData]);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut().then(() => navigate('/login'));
  };

  return (
    <div className="flex flex-col ">
      <h1 className="text-[40px] font-bold">Habit Tracker</h1>
      <button
        onClick={() => navigate('/profile')}
        className="bg-transparent hover:brightness-75 cursor-pointer"
      >
        Go to Profile
      </button>
      <button
        onClick={handleSignOut}
        className="bg-transparent hover:brightness-75 cursor-pointer"
      >
        Sign Out
      </button>
      <button
        onClick={() => navigate('/settings')}
        className="bg-transparent hover:brightness-75 cursor-pointer"
      >
        Settings
      </button>
      <div className="flex flex-col gap-8">
        {habits &&
          shuukanData &&
          habits
            .filter((habit) => habit.visible)
            .map((habit, index) => (
              <div
                key={index}
                className="hover:brightness-75 cursor-pointer"
                onClick={() => navigate('/habit?habit_id=' + habit.id)}
              >
                <HabitContextProvider habit={habit}>
                  <HabitTracker />
                </HabitContextProvider>
              </div>
            ))}
      </div>
    </div>
  );
}
