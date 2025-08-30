import { useContext, useEffect, useState } from 'react';
import './HabitTracker.css';
import DateBox from 'src/components/DateBox/DateBox';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';
import { TrackingCalendar } from '../TrackingCalendar/TrackingCalendar';

export default function HabitTracker() {
  const { habits, fetchTotals, dates, ref } = useContext(AppContext);
  const { habit } = useContext(HabitContext);
  const [totals, setTotals] = useState({});
  const [max, setMax] = useState(0);

  // gets totals for current habit
  useEffect(() => {
    if (!habit) return;
    fetchTotals(habit.id).then((res) => {
      Object.keys(res).filter((x) => dates.includes(x));
      setTotals(res);
      setMax(findMaxObj(res));
    });
  }, [fetchTotals, dates, habits, habit]);

  return (
    <div className="tracking-container unselectable" ref={ref}>
      {habit && (
        <div className="tracker-title-container">
          <h2>{habit.title}</h2>
          <DateBox ratio={totals[getLocalToday()] / max} />
        </div>
      )}
      <TrackingCalendar dates={dates} totals={totals} max={max} />
    </div>
  );
}
