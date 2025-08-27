import './HabitUpdater.css';

function HabitUpdater({ records, habit_id }) {
  return (
    <div className="tracking-container unselectable">
      <button
        className="styled-button clickable"
        onClick={() =>
          console.log(
            `adding task count to habit ${habit_id} material ${records.material_id}`
          )
        }
      >
        plus
      </button>
      <button
        className="styled-button clickable"
        onClick={() =>
          console.log(
            `subtracting task count to habit ${habit_id} material ${records.material_id}`
          )
        }
      >
        minus
      </button>
    </div>
  );
}

export default HabitUpdater;
