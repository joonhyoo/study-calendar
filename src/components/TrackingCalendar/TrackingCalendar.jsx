import DateBox from 'src/components/DateBox/DateBox';
import './TrackingCalendar.css';

export const TrackingCalendar = ({ dates, totals, max }) => {
  return (
    <div className="tracking-calendar">
      {dates.map((x, i) => (
        <DateBox key={i} ratio={totals[x] / max || 0} />
      ))}
    </div>
  );
};
