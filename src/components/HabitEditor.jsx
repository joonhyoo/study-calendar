import { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase';
import { MaterialEditor } from './MaterialEditor';
import { StyledButton } from './StyledButton';

const HabitEditor = ({ habit, handleArchiveHabit }) => {
  const [materials, setMaterials] = useState([]); // immutable, won't change.
  const [title, setTitle] = useState(habit.title); // this one changes

  // useEffect autosaves Habit Title only
  useEffect(() => {
    const saveTitle = async () => {
      const { error } = await supabase
        .from('habit')
        .update({ title: title })
        .eq('id', habit.id);
      if (error) console.warn(error);
    };

    if (title === habit.title) return;
    const handler = setTimeout(() => {
      console.log('Autosaving:', title);
      saveTitle();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [habit, title]);

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
    setMaterials(habit.habit_material.filter((material) => material.visible));
  }, [habit]);

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
      title: 'material title',
      description: 'description',
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
    <div className="flex flex-col gap-[16px] p-[16px] bg-[#212121]">
      <div className="flex">
        <input
          className="w-full text-[24px] font-bold p-[8px]"
          type="text"
          placeholder={title}
          value={title === 'habit title' ? '' : title}
          onChange={(e) => {
            const currTitle = e.target.value;
            let newTitle = currTitle;
            if (currTitle.length <= 20) newTitle = currTitle;
            if (currTitle.length === 0) newTitle = 'habit title';
            setTitle(newTitle);
          }}
        />
        <StyledButton
          onClick={() => handleArchiveHabit(habit.id)}
          content="archive"
        />
      </div>
      {materials.map((material) => (
        <MaterialEditor
          material={material}
          key={material.id}
          handleSave={handleSave}
          handleArchiveMaterial={handleArchiveMaterial}
        />
      ))}
      <div className="flex justify-center">
        <StyledButton onClick={handleAddMaterial} content={'+ Add material'} />
      </div>
    </div>
  );
};

export default HabitEditor;
