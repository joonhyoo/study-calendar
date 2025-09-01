import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HabitTracker from 'src/components/HabitTracker/HabitTracker';
import HabitUpdater from 'src/components/HabitUpdater/HabitUpdater';
import AppContext from 'src/contexts/AppContextProvider';
import { HabitContextProvider } from 'src/contexts/HabitContextProvider';
import { getLocalToday } from 'src/utils/helpers';
import supabase from 'src/utils/supabase';
import 'src/styles/Habit.css';

function Habit() {
  const [curr, setCurr] = useState(null);
  const { habits } = useContext(AppContext);
  const [records, setRecords] = useState({}); // fixed item => won't change unless saving/upserting new data
  const [todayCounts, setTodaysCounts] = useState({}); // stores all temporary changes that are to be staged
  const [isEditing, setIsEditing] = useState(false);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get('habit_id'));

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
      const id = material.id;
      tempCounts[id] = records[id]?.[getLocalToday()] ?? 0;
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
    if (habits) {
      setCurr(habits.find((habit) => habit.id === habitId));
      fetchMaterials(habitId);
    }
  }, [habits, habitId]);

  // fetches materials by habit id
  const fetchMaterials = async (habitId) => {
    const res = await supabase
      .from('habit_material')
      .select('*')
      .eq('habit_id', habitId);
    if (res) setMaterials(res.data);
  };

  useEffect(() => {
    // fetches records of all material ids
    const fetchAllRecords = async () => {
      const materialIds = materials.map((m) => m.id);
      const { data, error } = await supabase
        .from('habit_records')
        .select('created_on, material_id, count')
        .in('material_id', materialIds);
      if (error) {
        console.error(error?.message);
        return;
      }
      const records = {};
      materialIds.forEach((id) => (records[id] = {}));
      const todayCounts = {};
      data.forEach((record) => {
        records[record.material_id][record.created_on] = record.count;
        if (record.created_on === getLocalToday())
          todayCounts[record.material_id] = record.count;
      });
      setTodaysCounts(todayCounts);
      setRecords(records);
    };
    fetchAllRecords();
  }, [materials]);

  return (
    <div>
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1 style={{ marginBottom: '48px' }}>◂ home</h1>
      </a>
      {curr && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <HabitContextProvider habit={curr}>
            <HabitTracker />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {isEditing ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <button
                    onClick={handleSave}
                    className="styled-button clickable"
                  >
                    save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="styled-button clickable"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="styled-button clickable"
                >
                  edit
                </button>
              )}
            </div>

            {materials.map((material, index) => (
              <HabitUpdater
                key={index}
                records={records[material.id]}
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
