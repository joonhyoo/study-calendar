import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitEditor from 'src/components/HabitEditor';
import { StyledButton } from 'src/components/StyledButton';
import AppContext from 'src/contexts/AppContextProvider';
import supabase from 'src/utils/supabase';

function HabitSettings() {
  const { shuukanData } = useContext(AppContext);
  const [tempHabits, setTempHabits] = useState([]);
  const navigate = useNavigate();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!shuukanData) return;
    setTempHabits(shuukanData.filter((habit) => habit.visible));
  }, [shuukanData]);

  const generateUniqueID = () => {
    return Math.random().toString().slice(2, 11);
  };

  const handleArchiveHabit = (habitId) => {
    const temp = [...tempHabits];
    const index = temp.findIndex((habit) => habit.id === habitId);
    if (index > -1) {
      temp.splice(index, 1);
    }
    setTempHabits(temp);
    archiveHabit(habitId);
  };

  const archiveHabit = async (habitId) => {
    const { error } = await supabase
      .from('habit')
      .update({ visible: false })
      .eq('id', habitId);
    if (error) console.error(error.message);
  };

  const insertHabit = async ({ title, id, hexCode }) => {
    const { error } = await supabase
      .from('habit')
      .insert({ title: title, hexCode: hexCode, id: id });
    if (error) console.error(error.message);
  };

  const handleAddHabit = () => {
    const id = generateUniqueID();
    const temp = [...tempHabits];
    const newHabit = { title: 'habit title', id: id, habit_material: [] };
    temp.push(newHabit);
    insertHabit(newHabit);
    setTempHabits(temp);
  };

  const getHabitPosition = (habitId) => {
    return tempHabits.findIndex((habit) => habit.id === habitId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const pos1 = getHabitPosition(active.id);
    const pos2 = getHabitPosition(over.id);
    setTempHabits(() => {
      return arrayMove(tempHabits, pos1, pos2);
    });
    // swap the order of these two
    handleSwapOrder(active.id, over.id);
  };

  const handleSwapOrder = async (id1, id2) => {
    console.log(
      shuukanData.filter((shuukan) => [id1, id2].includes(shuukan.id))
    );
    // gets original positions
    const original = [
      supabase.from('habit').select('order').eq('id', id1),
      supabase.from('habit').select('order').eq('id', id2),
    ];
    const [{ data: pos1, error: fetchError1 }, { data: pos2, fetchError2 }] =
      await Promise.all(original);

    if (fetchError1) console.warn(fetchError1.message);
    if (fetchError2) console.warn(fetchError2.message);

    // swaps them
    const updates = [
      supabase.from('habit').update({ order: pos2[0].order }).eq('id', id1),
      supabase.from('habit').update({ order: pos1[0].order }).eq('id', id2),
    ];

    const [{ error: updateError1 }, { error: updateError2 }] =
      await Promise.all(updates);

    if (updateError1) console.warn(updateError1.message);
    if (updateError2) console.warn(updateError2.message);
  };

  return (
    <div className="flex flex-col gap-[48px]">
      <a
        onClick={() => navigate('/home')}
        className="hover:cursor-pointer hover:brightness-75"
      >
        <h1 className="text-[40px] font-bold">◂ home</h1>
      </a>
      <div className="flex flex-col gap-[32px]">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={tempHabits.map((habit) => habit.id)}
            strategy={verticalListSortingStrategy}
          >
            {tempHabits.map((habit) => (
              <HabitEditor
                key={habit.id}
                habit={habit}
                handleArchiveHabit={handleArchiveHabit}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="flex justify-center">
        <StyledButton onClick={handleAddHabit} content="add habit" />
      </div>
    </div>
  );
}

export default HabitSettings;
