import { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase';
import { MaterialEditor } from './MaterialEditor';
import './Editor.css';

const HabitEditor = ({ habit }) => {
  const [materials, setMaterials] = useState([]); // immutable, won't change.
  const [tempMaterials, setTempMaterials] = useState([]); // this one changes

  // fetches materials by habit id
  const fetchMaterials = async (habitId) => {
    const { data, error } = await supabase
      .from('habit_material')
      .select('title, description, id')
      .eq('habit_id', habitId)
      .eq('visible', true);
    if (error) {
      console.error(error.message);
    } else {
      setMaterials(data);
      setTempMaterials(data);
    }
  };

  // const upsertMaterial = async (habitId, title, desc, materialId) => {
  //   const { error } = await supabase.from('habit_material').upsert({
  //     id: Number(materialId),
  //     title: title,
  //     description: desc,
  //     habit_id: habitId,
  //   });
  //   if (error) console.error(error.message);
  // };

  // const archiveMaterial = async (materialId) => {
  //   const { error } = await supabase
  //     .from('habit_material')
  //     .update({ visible: false })
  //     .eq('id', materialId);
  //   if (error) console.error(error.message);
  // };

  useEffect(() => {
    fetchMaterials(habit.id);
  }, [habit.id]);

  const generateUniqueID = () => {
    return Math.random().toString().slice(2, 11);
  };

  const handleAddMaterial = () => {
    // new items probably need to be their own component to allow edit and delete
    const newItem = {
      title: 'Title',
      description: 'Description',
      id: generateUniqueID(),
    };
    const temp = [...tempMaterials];
    temp.push(newItem);
    setTempMaterials(temp);
  };

  const handleSave = (newTitle, newDesc, materialId) => {
    const temp = [...tempMaterials];
    const index = temp.findIndex((material) => material.id === materialId);
    const newItem = {
      title: newTitle,
      description: newDesc,
    };
    temp[index] = newItem;
    // upsertMaterial(habit.id, newTitle, newDesc, materialId).then();
    setTempMaterials(temp);
  };

  return (
    <div
      style={{
        backgroundColor: '#212121',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          defaultValue={habit.title}
          style={{
            width: '100%',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
          className={`updatable-input`}
        />
        <button className="clickable standard-button">archive</button>
      </div>
      {tempMaterials.map((material, index) => (
        <MaterialEditor
          material={material}
          key={index}
          handleSave={handleSave}
        />
      ))}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="clickable standard-button"
          onClick={handleAddMaterial}
        >
          + Add material
        </button>
      </div>
    </div>
  );
};

export default HabitEditor;
