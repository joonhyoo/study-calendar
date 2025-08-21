import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HabitTracker.css';
import DateBox from 'src/components/DateBox/DateBox';
import DropDown from 'src/components/DropDown/DropDown';
import { HabitContext } from 'src/contexts/contexts';

export default function HabitTracker() {
  const { title, records, id } = useContext(HabitContext);
  const [splicedRecords, setSplicedRecords] = useState(null);
  const [todaysData, setTodaysData] = useState(null);
  const navigate = useNavigate();
  const boxWidth = 12;
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
    <div
      className="tracking-container"
      onClick={() => navigate('/habit?id=' + id)}
    >
      <div className="tracker">
        <div className="tracker-title-container">
          <h2 className="white-text">
            {title} {id}
          </h2>
          {todaysData && <DateBox data={todaysData} width={25} />}
        </div>
        <div className="tracking-calendar" ref={ref}>
          {splicedRecords &&
            splicedRecords.map((data, index) => (
              <DateBox key={index} data={data} width={boxWidth} />
            ))}
        </div>
      </div>
      <DropDown />
    </div>
  );
}
