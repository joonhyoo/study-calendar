import './HabitTracker.css';
import DateBox from '../DateBox/DateBox';
import { useEffect, useRef, useState } from 'react';

function HabitTracker({ title, records }) {
  const [availCols, setAvailCols] = useState(0);
  const today = new Date().toLocaleDateString('en-us');

  const ref = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const currWidth = ref.current.clientWidth;
      setAvailCols(Math.floor((currWidth - 16) / 20) + 1);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="tracking-container">
      <h2 className="white-text tracker-title">{title}</h2>
      <div>{(availCols, today)}</div>
      <div className="tracking-calendar" ref={ref}>
        {records.slice(-availCols * 7).map((data, index) => (
          <DateBox key={index} data={data} width={'16px'} />
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;
