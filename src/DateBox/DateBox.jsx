import { useEffect, useState } from 'react';
import './DateBox.css';

function DateBox({ data, width, rgbColor }) {
  const [bgColor, setBgColor] = useState('rgb(241, 241, 241)');

  useEffect(() => {
    if (data.ratio) {
      setBgColor('rgba(' + rgbColor + ',' + data.ratio + ')');
    } else {
      setBgColor('#C4C4C4');
    }
  }, [data, bgColor, rgbColor]);

  return (
    <div
      id="date-box"
      className="unselectable"
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
