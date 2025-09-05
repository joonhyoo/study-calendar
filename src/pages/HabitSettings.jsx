import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitEditor from 'src/components/HabitEditor/HabitEditor';
import AppContext from 'src/contexts/AppContextProvider';
import 'src/styles/Habit.css';
import supabase from 'src/utils/supabase';

function HabitSettings() {
  const { habits } = useContext(AppContext);
  const [tempHabits, setTempHabits] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setTempHabits(habits.filter((habit) => habit.visible));
  }, [habits]);

  const generateUniqueID = () => {
    return Math.random().toString().slice(2, 11);
  };

  const handleArchiveHabit = (habitId) => {
    const temp = [...tempHabits];
    const index = temp.findIndex((habit) => habit.id === habitId);
    if (index > -1) {
      temp.splice(index, 1);
    }
    setTempHabits(temp);
    archiveHabit(habitId);
  };

  const archiveHabit = async (habitId) => {
    const { error } = await supabase
      .from('habit')
      .update({ visible: false })
      .eq('id', habitId);
    if (error) console.error(error.message);
  };

  const insertHabit = async ({ title, id, rgbColor }) => {
    const { error } = await supabase
      .from('habit')
      .insert({ title: title, rgbColor: rgbColor, id: id });
    if (error) console.error(error.message);
  };

  const handleAddHabit = () => {
    const id = generateUniqueID();
    const temp = [...tempHabits];
    const newHabit = { title: 'title', id: id, rgbColor: '0, 0, 0' };
    temp.push(newHabit);
    insertHabit(newHabit);
    setTempHabits(temp);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1>◂ home</h1>
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {tempHabits.map((habit, index) => (
          <HabitEditor
            key={index}
            habit={habit}
            handleArchiveHabit={handleArchiveHabit}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="clickable standard-button" onClick={handleAddHabit}>
          add habit
        </button>
      </div>
    </div>
  );
}

export default HabitSettings;
