import { useContext, useEffect, useState } from 'react';
import './HabitTracker.css';
import DateBox from 'src/components/DateBox/DateBox';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';

/*
  i have object of totals
  create array of dates len = (availcols * 7) =>
    from habit context but rn the problem is that it doesn't
    know how many to generate due to the width, but because all the widths
    are the same i think i can pull ref from a higher place and pass it through the context
  each date box can pull from the records
*/

export default function HabitTracker() {
  const { habit } = useContext(HabitContext);
  const { fetchTotals, dates, ref } = useContext(AppContext);
  const [totals, setTotals] = useState({});
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (!habit.id) return;
    fetchTotals(habit.id).then((res) => {
      Object.keys(res).filter((x) => dates.includes(x));
      setTotals(res);
      setMax(findMaxObj(res));
    });
  }, [habit.id, fetchTotals, dates]);
  return (
    <div className="tracking-container unselectable" ref={ref}>
      <div className="tracker-title-container">
        <h2>{habit.title}</h2>
        <DateBox
          ratio={totals[getLocalToday()] / max}
          rgbColor={habit.rgbColor}
        />
      </div>
      <div className="tracking-calendar">
        {dates.map((x, i) => (
          <DateBox key={i} ratio={totals[x] / max || 0} />
        ))}
      </div>
    </div>
  );
}
