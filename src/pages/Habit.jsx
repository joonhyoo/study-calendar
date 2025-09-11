import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';
import HabitUpdater from 'src/components/HabitUpdater/HabitUpdater';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';
import { getLocalToday } from 'src/utils/helpers';
import supabase from 'src/utils/supabase';

function Habit() {
  const [curr, setCurr] = useState(null);
  const { habits, shuukanData } = useContext(AppContext);
  const [savedCount, setSavedCount] = useState({}); // fixed item => won't change unless saving/upserting new data
  const [todayCounts, setTodaysCounts] = useState({}); // stores all temporary changes that are to be staged
  const [isEditing, setIsEditing] = useState(false);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get('habit_id'));

  const todayTotal = Object.values(todayCounts).reduce(
    (acc, sum) => acc + sum,
    0
  );

  // stages changes for each material id
  const handleSave = () => {
    // for todayCounts => upsert each
    Object.keys(todayCounts).forEach((materialId) => {
      updateCount(materialId, todayCounts[materialId]);
    });
    setIsEditing(false);
  };

  // updates count by material id
  const updateCount = async (materialId, newCount) => {
    const { error } = await supabase.from('habit_records').upsert({
      material_id: materialId,
      created_on: getLocalToday(),
      count: newCount,
    });
    if (error) console.error(error.message);
  };

  // returns changes back to fetched data
  const handleCancel = () => {
    resetTodayCounts();
    setIsEditing(false);
  };

  // resets todayCounts to data on fetched records
  const resetTodayCounts = () => {
    const tempCounts = {};
    materials.forEach((material) => {
      tempCounts[material.id] = savedCount[material.id] ?? 0;
    });
    setTodaysCounts(tempCounts);
  };

  const updateChanges = (materialId, newTodayCount) => {
    // updates changes object
    const temp = { ...todayCounts };
    temp[materialId] = newTodayCount;
    setTodaysCounts(temp);
  };

  useEffect(() => {
    if (!habits || !shuukanData) return;
    setCurr(habits.find((habit) => habit.id === habitId));
    const materials = shuukanData
      .find((shuukan) => shuukan.id === habitId)
      ?.habit_material.filter((material) => material.visible);
    setMaterials(materials);
  }, [habits, habitId, shuukanData]);

  useEffect(() => {
    if (!shuukanData) return;
    const todayCounts = {};
    shuukanData
      .find((shuukan) => shuukan.id === habitId)
      ?.habit_material.filter((material) => material.visible)
      .forEach((material) => {
        const todayRecord = material.habit_records.find(
          (record) => record.created_on === getLocalToday()
        );
        todayCounts[material.id] = todayRecord?.count || 0;
      });
    setTodaysCounts(todayCounts);
    setSavedCount(todayCounts);
  }, [habitId, materials, shuukanData]);

  return (
    <div>
      <a onClick={() => navigate('/home')} className="hover:cursor-pointer">
        <h1 style={{ marginBottom: '48px' }}>◂ home</h1>
      </a>
      {curr && (
        <div className="flex flex-col gap-[16px]">
          <HabitContextProvider habit={curr}>
            <HabitTracker todayTotal={todayTotal} />
            <div className="flex justify-end">
              {isEditing ? (
                <div className="flex gap-[8px]">
                  <button onClick={handleSave} className="hover:cursor-pointer">
                    save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="hover:cursor-pointer"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="hover:cursor-pointer"
                >
                  edit
                </button>
              )}
            </div>

            {materials
              .filter((material) => material.visible)
              .map((material, index) => (
                <HabitUpdater
                  key={index}
                  material={material}
                  todayCount={todayCounts[material.id]}
                  updateChanges={updateChanges}
                  isEditing={isEditing}
                />
              ))}
          </HabitContextProvider>
        </div>
      )}
    </div>
  );
}

export default Habit;
