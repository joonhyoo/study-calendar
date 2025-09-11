import { useContext, useEffect, useState } from 'react';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from './TrackingCalendar';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';

export default function HabitTracker({ todayTotal }) {
  const [max, setMax] = useState(0);
  const { ref, dates, shuukanData } = useContext(AppContext);
  const { habit } = useContext(HabitContext);
  const [localTotals, setLocalTotals] = useState({});
  const localToday = getLocalToday();

  // records: {created_on, count}
  // when page resize, or records change
  // update localTotals and max
  useEffect(() => {
    if (!shuukanData) return;
    const createRecords = () => {
      const shuukan = shuukanData.find((shuukan) => shuukan.id === habit.id);
      const materials = shuukan.habit_material;
      const rec = {};
      Object.keys(materials)
        .flatMap((id) => materials[id].habit_records)
        .forEach((item) => {
          if (rec[item.created_on]) {
            rec[item.created_on] += item.count || 0;
          } else {
            rec[item.created_on] = item.count || 0;
          }
        });
      return rec;
    };
    const records = createRecords();
    const totals = dates.reduce((res, date) => {
      res[date] = records?.[date] || 0;
      if (todayTotal && date === localToday) res[date] = todayTotal;
      return res;
    }, {});
    setLocalTotals(totals);
    setMax(findMaxObj(totals));
  }, [dates, habit.id, localToday, shuukanData, todayTotal]);

  return (
    <div className="bg-[#323334] flex flex-col gap-[24px] p-[24px]" ref={ref}>
      {habit && (
        <div className="flex justify-between">
          <h2 className="font-bold text-[20px]">{habit.title}</h2>
        </div>
      )}
      <TrackingCalendar totals={localTotals} max={max} />
    </div>
  );
}
