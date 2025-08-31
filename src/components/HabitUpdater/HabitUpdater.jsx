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
      <div className="updater-container unselectable">
        <h4 style={{ fontSize: '20px', fontWeight: 700 }}>{material.title}</h4>
        <TrackingCalendar totals={materialTotals} max={max} short />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p>Completed:</p>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              width: '86px',
              justifyContent: 'center',
              backgroundColor: isEditing && 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {isEditing && (
              <button
                className="modifier-button clickable"
                onClick={handleMinus}
              >
                &minus;
              </button>
            )}
            <p style={{ width: '30px', textAlign: 'center' }}>
              {count && count}
            </p>
            {isEditing && (
              <button
                className="modifier-button clickable"
                onClick={handlePlus}
              >
                &#43;
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default HabitUpdater;
