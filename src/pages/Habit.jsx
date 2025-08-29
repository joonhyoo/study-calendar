import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';
import HabitUpdater from 'src/components/HabitUpdater/HabitUpdater';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';
import supabase from 'src/utils/supabase';

function Habit() {
  const [curr, setCurr] = useState(null);
  const { habits } = useContext(AppContext);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get('habit_id'));

  useEffect(() => {
    if (habits) {
      setCurr(habits.find((habit) => habit.id === habitId));
      fetchMaterials(habitId);
    }
  }, [habits, habitId]);

  // fetches materials by habit id
  const fetchMaterials = (habitId) => {
    supabase
      .from('habit_material')
      .select('*')
      .eq('habit_id', habitId)
      .then((res) => setMaterials(res.data));
  };

  return (
    <div>
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1>◂ home</h1>
      </a>
      {curr && (
        <div>
          <HabitContextProvider habit={curr}>
            <HabitTracker />
            {materials.map((material, index) => (
              <HabitUpdater key={index} material={material} />
            ))}
          </HabitContextProvider>
        </div>
      )}
    </div>
  );
}

export default Habit;
