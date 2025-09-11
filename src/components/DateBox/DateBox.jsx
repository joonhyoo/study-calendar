import { useContext, useEffect, useState } from 'react';
import './DateBox.css';
import HabitContext from 'src/contexts/HabitContextProvider';

function DateBox({ ratio }) {
  const { habit } = useContext(HabitContext);
  const [bgColor, setBgColor] = useState('#f1f1f1');

  useEffect(() => {
    if (ratio === 0) {
      setBgColor('#C4C4C4');
    } else {
      setBgColor(habit.hexCode);
    }
  }, [bgColor, habit.hexCode, ratio]);

  return (
    <div
      className="date-box"
      style={{
        backgroundColor: bgColor,
        opacity: ratio === 0 ? 100 : ratio,
        width: 12,
        height: 12,
      }}
    />
  );
}

export default DateBox;
