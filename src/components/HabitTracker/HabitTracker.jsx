import { useContext, useEffect, useState } from 'react';
import './HabitTracker.css';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from '../TrackingCalendar/TrackingCalendar';
import { findMaxObj } from 'src/utils/helpers';

export default function HabitTracker() {
  const [totals, setTotals] = useState({});
  const [max, setMax] = useState(0);
  const { ref, dates, fetchTotals } = useContext(AppContext);
  const { habit } = useContext(HabitContext);

  useEffect(() => {
    if (!habit) return;
    fetchTotals(habit.id).then((res) => {
      const shortTotals = {};
      dates.forEach((date) => (shortTotals[date] = res[date] || 0));
      setTotals(shortTotals);
      setMax(findMaxObj(shortTotals));
    });
  }, [fetchTotals, dates, habit]);

  return (
    <div className="tracking-container unselectable" ref={ref}>
      {habit && (
        <div className="tracker-title-container">
          <h2>{habit.title}</h2>
        </div>
      )}
      <TrackingCalendar totals={totals} max={max} />
    </div>
  );
}
