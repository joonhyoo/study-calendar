import './HabitTracker.css';
import DateBox from '../DateBox/DateBox';
import { useEffect, useRef, useState } from 'react';

function HabitTracker({ title, records }) {
  const [splicedRecords, setSplicedRecords] = useState(records);
  const [todaysData, setTodaysData] = useState(null);
  const boxWidth = 16;
  const ref = useRef(null);

  const findMax = (updatedRecords) => {
    let max = 0;
    for (const rec of updatedRecords) {
      max = max > rec.total ? max : rec.total;
    }
    return max;
  };

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const currWidth = ref.current.clientWidth;
      const availCols = Math.max(
        1,
        Math.floor((currWidth - boxWidth) / (boxWidth + 4)) + 1
      );
      const tempRecords = records.slice(-availCols * 7);
      setTodaysData(tempRecords[tempRecords.length - 1]);
      updateRatio(tempRecords);
      setSplicedRecords(tempRecords);
    };

    const updateRatio = (updatedRecords) => {
      const max = findMax(updatedRecords);
      for (const rec of updatedRecords) {
        rec['ratio'] = rec.total / max;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        handleResize();
      }
    });
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [records]);

  return (
    <div className="tracking-container">
      <div style={{ display: 'flex' }}>
        <h2 className="white-text tracker-title">{title}</h2>
        {todaysData && <DateBox data={todaysData} width={25} />}
      </div>
      <div className="tracking-calendar" ref={ref}>
        {splicedRecords.map((data, index) => (
          <DateBox key={index} data={data} width={boxWidth} />
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;
