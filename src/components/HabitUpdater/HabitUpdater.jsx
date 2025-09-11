import { useContext, useEffect, useState } from 'react';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from '../TrackingCalendar/TrackingCalendar';
import AppContext from 'src/contexts/AppContextProvider';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';

function HabitUpdater({ material, isEditing, updateChanges, todayCount }) {
  const { dates, shuukanData } = useContext(AppContext);
  const { habit } = useContext(HabitContext);
  const [localTotals, setLocalTotals] = useState({});
  const [max, setMax] = useState(0);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!shuukanData) return;
    const createRecords = () => {
      const shuukan = shuukanData.find((shuukan) => shuukan.id === habit.id);
      const materials = shuukan.habit_material;
      const rec = {};
      materials
        .find((m) => m.id === material.id)
        .habit_records.forEach(
          (record) => (rec[record.created_on] = record.count)
        );
      return rec;
    };
    setRecords(createRecords());
  }, [dates, habit.id, material.id, shuukanData]);

  // when page resize, or records change
  // update localTotals and max
  useEffect(() => {
    const shortDates = dates.slice(-dates.length / 7);
    const shortTotals = shortDates.reduce((res, date) => {
      res[date] = date === getLocalToday() ? todayCount : records?.[date] || 0;
      return res;
    }, {});
    setLocalTotals(shortTotals);
    setMax(findMaxObj(shortTotals));
  }, [dates, records, todayCount]);

  const handlePlus = () => {
    updateChanges(material.id, todayCount + 1);
  };

  const handleMinus = () => {
    updateChanges(material.id, todayCount > 0 ? todayCount - 1 : 0);
  };

  return (
    habit && (
      <div className="updater-container unselectable">
        <h4 style={{ fontSize: '20px', fontWeight: 700 }}>{material.title}</h4>
        <TrackingCalendar totals={localTotals} max={max} short />
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
              {todayCount && todayCount}
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
