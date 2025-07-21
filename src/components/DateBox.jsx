import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function DateBox({ data, setCurrRecord }) {
  const [bgColor, setBgColor] = useState('rgb(241, 241, 241)');

  useEffect(() => {
    if (data.ratio) {
      setBgColor('rgba(144, 238, 144, ' + data.ratio + ')');
    }
  }, [data]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '3px',
        backgroundColor: bgColor,
        aspectRatio: 1,
      }}
      onMouseEnter={() => setCurrRecord(data)}
    >
      {data.total}
    </div>
  );
}

DateBox.propTypes = {};

export default DateBox;
