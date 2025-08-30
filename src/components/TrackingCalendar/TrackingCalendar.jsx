import DateBox from 'src/components/DateBox/DateBox';
import './TrackingCalendar.css';

export const TrackingCalendar = ({ totals, max, short }) => {
  return (
    <div className={`tracking-calendar ${short && 'short'}`}>
      {totals &&
        Object.keys(totals).map((x, i) => (
          <DateBox key={i} ratio={totals[x] / max || 0} />
        ))}
    </div>
  );
};
