import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';
import HabitUpdater from 'src/components/HabitUpdater/HabitUpdater';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';

function Habit() {
  const [curr, setCurr] = useState(null);
  const { habits } = useContext(AppContext);
  // const [materials, setMaterials] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get('habit_id'));
  useEffect(() => {
    if (habits) {
      setCurr(habits.find((habit) => habit.id === habitId));
    }
  }, [habits, habitId]);

  // useEffect(() => {
  //   const materialIds = new Set();
  //   const habitByMaterial = [];
  //   if (curr) {
  //     curr.records
  //       .flatMap((record) => record.items)
  //       .forEach((x) => materialIds.add(x.material_id));
  //     materialIds.forEach((material_id) => {
  //       const temp = curr.records.map((record) => {
  //         return {
  //           created_on: record.created_on,
  //           records: record.items.filter(
  //             (item) => item.material_id === material_id
  //           ),
  //         };
  //       });
  //       habitByMaterial.push({ material_id: material_id, temp });
  //     });
  //     setMaterials(habitByMaterial);
  //   }
  // }, [curr]);

  return (
    <div>
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1>◂ home</h1>
      </a>
      {curr && (
        <div>
          <HabitContextProvider habit={curr}>
            <HabitTracker />
          </HabitContextProvider>

          {/* {materials &&
            materials.map((material, index) => (
              <HabitUpdater
                records={material}
                key={index}
                habit_id={curr.habit_id}
              />
            ))} */}
        </div>
      )}
    </div>
  );
}

export default Habit;
