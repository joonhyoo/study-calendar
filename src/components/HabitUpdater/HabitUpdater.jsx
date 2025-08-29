import { useContext } from 'react';
import './HabitUpdater.css';
import HabitContext from 'src/contexts/HabitContextProvider';

function HabitUpdater({ material, onRecordChange, count }) {
  const { habit } = useContext(HabitContext);

  const handlePlus = () => {
    const newRec = count + 1;
    onRecordChange(material.id, newRec);
  };

  const handleMinus = () => {
    const newRec = count > 0 ? count - 1 : 0;
    onRecordChange(material.id, newRec);
  };

  return (
    habit && (
      <div className="tracking-container unselectable">
        <p>{material.title}</p>
        <div style={{ display: 'flex' }}>
          <button className="styled-button clickable" onClick={handleMinus}>
            minus
          </button>
          <p>count: {count && count}</p>
          <button className="styled-button clickable" onClick={handlePlus}>
            plus
          </button>
        </div>
      </div>
    )
  );
}

export default HabitUpdater;
