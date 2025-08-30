import { useContext, useEffect, useState } from 'react';
import './HabitUpdater.css';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from '../TrackingCalendar/TrackingCalendar';
import AppContext from 'src/contexts/AppContextProvider';
import { findMaxObj } from 'src/utils/helpers';

function HabitUpdater({ material, onRecordChange, count, isEditing }) {
  const { habit } = useContext(HabitContext);
  const [materialTotals, setMaterialTotals] = useState({});
  const [max, setMax] = useState(0);
  const { fetchMaterialTotals, dates } = useContext(AppContext);

  useEffect(() => {
    if (!material) return;
    const shortDates = dates.slice(-dates.length / 7);
    fetchMaterialTotals(material.id).then((totals) => {
      const shortTotals = {};
      shortDates.forEach((date) => (shortTotals[date] = totals[date] || 0));
      setMaterialTotals(shortTotals);
      setMax(findMaxObj(shortTotals));
    });
  }, [dates, fetchMaterialTotals, material]);

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
        <TrackingCalendar totals={materialTotals} max={max} short />
        <div style={{ display: 'flex' }}>
          {isEditing && (
            <button className="styled-button clickable" onClick={handleMinus}>
              minus
            </button>
          )}
          <p>count: {count && count}</p>
          {isEditing && (
            <button className="styled-button clickable" onClick={handlePlus}>
              plus
            </button>
          )}
        </div>
      </div>
    )
  );
}

export default HabitUpdater;
