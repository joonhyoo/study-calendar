import { useContext, useEffect, useState } from 'react';
import AppContext from 'src/contexts/AppContextProvider';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from './TrackingCalendar';
import { findMaxObj, getLocalToday } from 'src/utils/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function HabitTracker({ todayTotal }) {
  const [max, setMax] = useState(0);
  const { habit } = useContext(HabitContext);
  const { dates, shuukanData } = useContext(AppContext);
  const [localTotals, setLocalTotals] = useState({});
  const [title, setTitle] = useState('');
  const [hexCode, setHexCode] = useState('');
  const localToday = getLocalToday();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: habit.id });

  const style = {
    transition: transition,
    transform: CSS.Translate.toString(transform),
  };

  // records: {created_on, count}
  // when page resize, or records change
  // update localTotals and max
  useEffect(() => {
    if (!shuukanData) return;
    const createRecords = () => {
      const shuukan = shuukanData.find((shuukan) => shuukan.id === habit.id);
      setTitle(shuukan.title);
      setHexCode(shuukan.hexCode);
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
    <div
      className="bg-[#323334] flex flex-col gap-[24px] p-[24px]"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between">
        <h2 className="font-bold text-[20px]">{title}</h2>
        <div
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing"
        >
          ✢
        </div>
      </div>
      <TrackingCalendar totals={localTotals} max={max} hexCode={hexCode} />
    </div>
  );
}
