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
  const [changes, setChanges] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [old, setOld] = useState({});
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = Number(searchParams.get('habit_id'));

  const handleOnRecordChange = (materialId, changedRecord) => {
    const tempChanges = { ...changes };
    tempChanges[materialId] = changedRecord;
    setChanges(tempChanges);
  };

  const handleSave = () => {
    materials.forEach((material) => {
      if (material.id in changes) {
        updateCount(material.id, changes[material.id]);
      }
    });
    setOld(changes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setChanges(old);
    setIsEditing(false);
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

  // updates count by material id
  const updateCount = (materialId, newCount) => {
    supabase
      .from('habit_records')
      .upsert({
        material_id: materialId,
        created_on: getLocalToday(),
        count: newCount,
      })
      .then((res) => {
        if (res.error) console.error(res.error);
      });
  };

  useEffect(() => {
    // fetches counts of all material ids and updates old
    const fetchAllCounts = async () => {
      const materialIds = materials.map((m) => m.id);
      const { data, error } = await supabase
        .from('habit_records')
        .select('material_id, count')
        .in('material_id', materialIds)
        .eq('created_on', getLocalToday());

      if (error) {
        console.error(error.message);
        setOld({});
        return;
      }

      // Map results to { [materialId]: { count } }
      const counts = {};
      materialIds.forEach((id) => {
        const found = data.find((d) => d.material_id === id);
        counts[id] = found ? found.count : 0;
      });
      setOld(counts);
      setChanges(counts);
    };

    fetchAllCounts();
  }, [materials]);

  return (
    <div>
      <a onClick={() => navigate('/home')} className="clickable unstyled-link">
        <h1 style={{ paddingBottom: '48px' }}>◂ home</h1>
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
                count={changes && changes[material.id]}
                material={material}
                onRecordChange={handleOnRecordChange}
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
