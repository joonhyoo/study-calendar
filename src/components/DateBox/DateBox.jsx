import { useContext, useEffect, useState } from 'react';
import './DateBox.css';
import HabitContext from 'src/contexts/HabitContextProvider';

function DateBox({ ratio }) {
  const { habit } = useContext(HabitContext);
  const [bgColor, setBgColor] = useState('rgb(241, 241, 241)');

  useEffect(() => {
    if (ratio === 0) {
      setBgColor('#C4C4C4');
    } else {
      setBgColor('rgba(' + habit.hexCode + ',' + ratio + ')');
    }
  }, [bgColor, habit.hexCode, ratio]);

  return (
    <div
      className="date-box"
      style={{
        backgroundColor: bgColor,
        width: 12,
        height: 12,
      }}
    />
  );
}

export default DateBox;
