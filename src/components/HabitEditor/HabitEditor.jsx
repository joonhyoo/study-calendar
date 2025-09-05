import { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase';
import { MaterialEditor } from './MaterialEditor';
import './Editor.css';

const HabitEditor = ({ habit, handleArchiveHabit }) => {
  const [materials, setMaterials] = useState([]); // immutable, won't change.
  const [title, setTitle] = useState(habit.title); // this one changes

  // useEffect autosaves Habit Title only
  useEffect(() => {
    if (title === habit.title) return;
    const handler = setTimeout(() => {
      console.log('Autosaving:', title);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [habit.title, title]);

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
    }
  };

  const handleArchiveMaterial = (materialId) => {
    const tempMaterials = [...materials];
    const index = tempMaterials.findIndex(
      (material) => material.id === materialId
    );
    if (index > -1) {
      tempMaterials.splice(index, 1);
    }
    setMaterials(tempMaterials);
    archiveMaterial(materialId);
  };

  const archiveMaterial = async (materialId) => {
    const { error } = await supabase
      .from('habit_material')
      .update({ visible: false })
      .eq('id', materialId);
    if (error) console.error(error.message);
  };

  useEffect(() => {
    fetchMaterials(habit.id);
  }, [habit.id]);

  const generateUniqueID = () => {
    return Math.random().toString().slice(2, 11);
  };

  const upsertMaterial = async (habitId, material) => {
    const { error } = await supabase.from('habit_material').upsert({
      id: Number(material.id),
      title: material.title,
      description: material.description,
      habit_id: habitId,
    });
    if (error) console.error(error.message);
  };

  const handleAddMaterial = () => {
    const newItem = {
      title: 'Title',
      description: 'Description',
      id: generateUniqueID(),
    };
    const tempMaterials = [...materials];
    tempMaterials.push(newItem);
    upsertMaterial(habit.id, newItem);
    setMaterials(tempMaterials);
  };

  const handleSave = (newTitle, newDesc, materialId) => {
    const tempMaterials = [...materials];
    const index = tempMaterials.findIndex(
      (material) => material.id === materialId
    );
    const savedItem = {
      id: materialId,
      title: newTitle,
      description: newDesc,
    };
    tempMaterials[index] = savedItem;
    upsertMaterial(habit.id, savedItem);
    setMaterials(tempMaterials);
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
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 20) setTitle(e.target.value);
          }}
          style={{
            width: '100%',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
          className={`updatable-input`}
        />
        <button
          className="clickable standard-button"
          onClick={() => handleArchiveHabit(habit.id)}
        >
          archive
        </button>
      </div>
      {materials.map((material, index) => (
        <MaterialEditor
          material={material}
          key={index}
          handleSave={handleSave}
          handleArchiveMaterial={handleArchiveMaterial}
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
