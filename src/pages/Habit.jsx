import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HabitTracker from "src/components/HabitTracker";
import HabitUpdater from "src/components/HabitUpdater";
import { StyledButton } from "src/components/StyledButton";
import AppContext from "src/contexts/AppContextProvider";
import { HabitContextProvider } from "src/contexts/HabitContextProvider";
import supabase from "src/services/supabase";

function Habit() {
  const [curr, setCurr] = useState(null);
  const { shuukanData, localToday } = useContext(AppContext);
  const [savedCount, setSavedCount] = useState({}); // fixed item => won't change unless saving/upserting new data
  const [todayCounts, setTodaysCounts] = useState({}); // stores all temporary changes that are to be staged
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get("habit_id"));

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
  };

  // updates count by material id
  const updateCount = async (materialId, newCount) => {
    const { error } = await supabase.from("habit_records").upsert({
      material_id: materialId,
      created_on: localToday,
      count: newCount,
    });
    if (error) console.error(error.message);
  };

  const updateChanges = (materialId, newTodayCount) => {
    // updates changes object
    const temp = { ...todayCounts };
    temp[materialId] = newTodayCount;
    setTodaysCounts(temp);
  };

  useEffect(() => {
    if (!shuukanData) return;
    setCurr(shuukanData.find((habit) => habit.id === habitId));
    const materials = shuukanData
      .find((shuukan) => shuukan.id === habitId)
      ?.habit_material.filter((material) => material.visible);
    setMaterials(materials);
  }, [habitId, shuukanData]);

  useEffect(() => {
    if (!shuukanData) return;
    const todayCounts = {};
    shuukanData
      .find((shuukan) => shuukan.id === habitId)
      ?.habit_material.filter((material) => material.visible)
      .forEach((material) => {
        const todayRecord = material.habit_records.find(
          (record) => record.created_on === localToday
        );
        todayCounts[material.id] = todayRecord?.count || 0;
      });
    setTodaysCounts(todayCounts);
    setSavedCount(todayCounts);
  }, [habitId, localToday, materials, shuukanData]);

  return (
    <div>
      {curr && (
        <div className="flex flex-col gap-[16px]">
          <HabitContextProvider habit={curr}>
            <HabitTracker todayTotal={todayTotal} />
            <div className="flex justify-end">
              <div className="flex">
                <StyledButton onClick={handleSave} content={"save"} />
              </div>
            </div>

            {materials
              .filter((material) => material.visible)
              .map((material) => (
                <HabitUpdater
                  key={material.id}
                  material={material}
                  todayCount={todayCounts[material.id]}
                  updateChanges={updateChanges}
                />
              ))}
          </HabitContextProvider>
        </div>
      )}
    </div>
  );
}

export default Habit;
