import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import HabitTracker from 'src/components/HabitTracker';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';
import { StyledButton } from 'src/components/StyledButton';

export default function Home() {
  const { signOut, shuukanData, loadShuukanData } = useContext(AppContext);

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
      <StyledButton
        content={'Go to Profile'}
        onClick={() => navigate('/profile')}
      />
      <StyledButton onClick={handleSignOut} content={'Sign Out'} />
      <StyledButton
        onClick={() => navigate('/settings')}
        content={'Settings'}
      />
      <div className="flex flex-col gap-8">
        {shuukanData &&
          shuukanData
            .filter((habit) => habit.visible)
            .map((habit) => (
              <div
                key={habit.id}
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
