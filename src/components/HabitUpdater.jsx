import { useContext, useEffect, useState } from 'react';
import HabitContext from 'src/contexts/HabitContextProvider';
import { TrackingCalendar } from './TrackingCalendar';
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
      <div className="bg-[#323334] flex flex-col gap-[16px] p-[24px]">
        <h4 className="text-[20px] font-[700]">{material.title}</h4>
        <TrackingCalendar totals={localTotals} max={max} short />
        <div className="flex justify-between items-center">
          <p>Completed:</p>
          <div
            className={
              'flex gap-[4px] p-[4px] w-[86px] justify-center ' +
              (isEditing && 'bg-[#ffffff0d]')
            }
          >
            {isEditing && (
              <button className="hover:cursor-pointer" onClick={handleMinus}>
                &minus;
              </button>
            )}
            <p className="w-[30px] text-center">{todayCount && todayCount}</p>
            {isEditing && (
              <button className="hover:cursor-pointer" onClick={handlePlus}>
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
