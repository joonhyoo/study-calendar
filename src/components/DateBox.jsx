import { useContext } from 'react';
import HabitContext from 'src/contexts/HabitContextProvider';

function DateBox({ ratio }) {
  const { habit } = useContext(HabitContext);
  return (
    <div
      className="size-[12px] rounded-[3px]"
      style={{
        opacity: ratio === 0 ? 1 : ratio,
        backgroundColor: ratio === 0 ? '#C4C4C4' : habit.hexCode,
      }}
    />
  );
}

export default DateBox;
