import { useContext, useEffect, useState } from 'react';
import './HabitTracker.css';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from '../TrackingCalendar/TrackingCalendar';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';

export default function HabitTracker({ todayTotal, records }) {
  const [max, setMax] = useState(0);
  const { ref, dates } = useContext(AppContext);
  const { habit } = useContext(HabitContext);

  const [localTotals, setLocalTotals] = useState({});

  // when page resize, or records change
  // update localTotals and max
  useEffect(() => {
    const totals = dates.reduce((res, date) => {
      res[date] = date === getLocalToday() ? todayTotal : records?.[date] || 0;
      return res;
    }, {});
    setLocalTotals(totals);
    setMax(findMaxObj(totals));
  }, [dates, records, todayTotal]);

  return (
    <div className="tracking-container unselectable" ref={ref}>
      {habit && (
        <div className="tracker-title-container">
          <h2>{habit.title}</h2>
        </div>
      )}
      <TrackingCalendar totals={localTotals} max={max} />
    </div>
  );
}
