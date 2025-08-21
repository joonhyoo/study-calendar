import { useContext, useEffect, useState } from 'react';
import './DateBox.css';
import { HabitContext } from 'src/contexts/contexts';

function DateBox({ data, width }) {
  const [bgColor, setBgColor] = useState('rgb(241, 241, 241)');
  const { rgbColor } = useContext(HabitContext);
  useEffect(() => {
    if (data.ratio) {
      setBgColor('rgba(' + rgbColor + ',' + data.ratio + ')');
    } else {
      setBgColor('#C4C4C4');
    }
  }, [data, bgColor, rgbColor]);

  return (
    <div
      className="date-box"
      style={{
        backgroundColor: bgColor,
        width: width,
        height: width,
      }}
    ></div>
  );
}

DateBox.propTypes = {};

export default DateBox;
