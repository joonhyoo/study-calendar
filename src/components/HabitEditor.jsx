import { useEffect, useRef, useState } from 'react';
import supabase from 'src/utils/supabase';
import { MaterialEditor } from './MaterialEditor';
import { StyledButton } from './StyledButton';
import DateBox from './DateBox';
import { TwitterPicker } from 'react-color';

const HabitEditor = ({ habit, handleArchiveHabit }) => {
  const [materials, setMaterials] = useState([]); // immutable, won't change.
  const [title, setTitle] = useState(habit.title); // this one changes
  const [hex, setHex] = useState(habit.hexCode);
  const [showColors, setShowColors] = useState(false);

  // useEffect autosaves Habit Title only
  useEffect(() => {
    const saveField = async (field, value) => {
      console.log('Autosaving:', field, value);
      const { error } = await supabase
        .from('habit')
        .update({ [field]: value })
        .eq('id', habit.id);
      if (error) console.warn(error);
    };
    const handler = setTimeout(() => {
      if (title !== habit.title) saveField('title', title);
      if (hex !== habit.hexCode) saveField('hexCode', hex);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [habit, hex, title]);

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
      <div className="flex items-center gap-[16px]">
        <div className="relative flex items-center">
          <button
            className={'hover:cursor-pointer'}
            onClick={() => setShowColors((prev) => !prev)}
          >
            <DateBox ratio={1} hexCode={hex} size={24} />
          </button>
          {showColors && (
            <div className="absolute top-10 -translate-x-2">
              <TwitterPicker
                color={hex}
                colors={[
                  '#FF7B88', // coral red
                  '#FFB37B', // peachy orange
                  '#FFD37B', // golden yellow
                  '#88E17B', // soft green
                  '#7BCAFF', // sky blue
                  '#887BFF', // lavender-blue
                  '#FF7BE1', // pastel magenta
                ]}
                onChange={(color) => setHex(color.hex)}
              />
            </div>
          )}
        </div>
        <input
          className="w-full text-[20px] font-bold"
          type="text"
          placeholder={'habit title'}
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
