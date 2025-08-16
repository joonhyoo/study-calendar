import { useEffect, useState } from 'react';
import './DateBox.css';

function DateBox({ data }) {
  const [bgColor, setBgColor] = useState('rgb(241, 241, 241)');

  useEffect(() => {
    if (data.ratio) {
      setBgColor('rgba(144, 238, 144, ' + data.ratio + ')');
    }
  }, [data]);

  return (
    <div
      id="date-box"
      className="unselectable"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {/* <p>{data.total}</p> */}
    </div>
  );
}

DateBox.propTypes = {};

export default DateBox;
