import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HabitEditor from "src/components/HabitEditor";
import { StyledButton } from "src/components/StyledButton";
import AppContext from "src/contexts/AppContextProvider";
import supabase from "src/utils/supabase";

function HabitSettings() {
	const { shuukanData } = useContext(AppContext);
	const [tempHabits, setTempHabits] = useState([]);
	const navigate = useNavigate();

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
			.from("habit")
			.update({ visible: false })
			.eq("id", habitId);
		if (error) console.error(error.message);
	};

	const insertHabit = async ({ title, id, hexCode }) => {
		const { error } = await supabase
			.from("habit")
			.insert({ title: title, hexCode: hexCode, id: id });
		if (error) console.error(error.message);
	};

	const handleAddHabit = () => {
		const id = generateUniqueID();
		const temp = [...tempHabits];
		const newHabit = { title: "habit title", id: id, habit_material: [] };
		temp.push(newHabit);
		insertHabit(newHabit);
		setTempHabits(temp);
	};

	return (
		<div className="flex flex-col gap-[48px]">
			<a
				onClick={() => navigate("/home")}
				className="hover:cursor-pointer hover:brightness-75"
			>
				<h1 className="text-[40px] font-bold">◂ home</h1>
			</a>
			<div className="flex flex-col gap-[32px]">
				{tempHabits.map((habit) => (
					<HabitEditor
						key={habit.id}
						habit={habit}
						handleArchiveHabit={handleArchiveHabit}
					/>
				))}
			</div>
			<div className="flex justify-center">
				<StyledButton onClick={handleAddHabit} content="add habit" />
			</div>
		</div>
	);
}

export default HabitSettings;
