import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitEditor from 'src/components/HabitEditor/HabitEditor';
import AppContext from 'src/contexts/AppContextProvider';
import 'src/styles/Habit.css';

function HabitSettings() {
  const { habits } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div>
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1 style={{ marginBottom: '48px' }}>◂ home</h1>
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {habits.map((habit, index) => (
          <HabitEditor key={index} habit={habit} />
        ))}
      </div>
    </div>
  );
}

export default HabitSettings;
