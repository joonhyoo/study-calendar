import { useContext, useEffect, useState } from 'react';
import './HabitUpdater.css';
import HabitContext from 'src/contexts/HabitContextProvider';
import supabase from 'src/utils/supabase';
import { getLocalToday } from 'src/utils/helpers';

function HabitUpdater({ material }) {
  const { habit } = useContext(HabitContext);
  const [record, setRecord] = useState(0);
  const [old, setOld] = useState(0);

  useEffect(() => {
    fetchCount(material.id);
  }, [material.id]);

  // fetches count by material id
  const fetchCount = (materialId) => {
    supabase
      .from('habit_records')
      .select('*')
      .eq('material_id', materialId)
      .eq('created_on', getLocalToday())
      .then((res) => {
        const temp = res.data.length ? res.data[0].count : 0;
        setOld(temp);
        setRecord(temp);
      });
  };

  // updates count by material id
  const updateCount = (materialId) => {
    supabase
      .from('habit_records')
      .upsert({
        material_id: materialId,
        created_on: getLocalToday(),
        count: record,
      })
      .then((res) => {
        console.log(`updating ${material.title} from ${old} to ${record}`);
        console.log(res);
      });
  };

  const cancel = () => {
    setRecord(old);
  };

  return (
    habit && (
      <div className="tracking-container unselectable">
        <p>{material.title}</p>
        <div style={{ display: 'flex' }}>
          <button
            className="styled-button clickable"
            onClick={() => setRecord((prev) => prev - 1)}
          >
            minus
          </button>
          <p>count: {record && record}</p>
          <button
            className="styled-button clickable"
            onClick={() => setRecord((prev) => prev + 1)}
          >
            plus
          </button>
        </div>
        <button
          className="styled-button clickable"
          onClick={() => updateCount(material.id)}
        >
          save
        </button>
        <button className="styled-button clickable" onClick={() => cancel()}>
          cancel
        </button>
      </div>
    )
  );
}

export default HabitUpdater;
