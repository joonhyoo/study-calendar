import DateBox from 'src/components/DateBox';

export const TrackingCalendar = ({ totals, max, short }) => {
  return (
    <div
      className={
        'gap-[4px] ' + (short ? 'flex' : 'grid grid-flow-col grid-rows-7')
      }
    >
      {totals &&
        Object.keys(totals).map((x, i) => (
          <DateBox key={i} ratio={totals[x] / max || 0} />
        ))}
    </div>
  );
};
