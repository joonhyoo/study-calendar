import {
	closestCorners,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HabitTracker from "src/components/HabitTracker";
import { StyledButton } from "src/components/StyledButton";
import AppContext from "src/contexts/AppContextProvider";
import { HabitContextProvider } from "src/contexts/HabitContextProvider";
import supabase from "src/utils/supabase";

export default function Home() {
	const { signOut, shuukanData, loadShuukanData, setShuukanData } =
		useContext(AppContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useEffect(() => {
		loadShuukanData();
	}, [loadShuukanData]);

	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut().then(() => navigate("/login"));
	};

	const getHabitPosition = (habitId) => {
		return shuukanData.findIndex((habit) => habit.id === habitId);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id === over.id) return;
		const pos1 = getHabitPosition(active.id);
		const pos2 = getHabitPosition(over.id);
		setShuukanData(() => {
			return arrayMove(shuukanData, pos1, pos2);
		});
		// swap the order of these two
		handleSwapOrder(active.id, over.id);
	};

	const handleSwapOrder = async (id1, id2) => {
		// gets original positions
		const original = [
			supabase.from("habit").select("order").eq("id", id1),
			supabase.from("habit").select("order").eq("id", id2),
		];
		const [{ data: pos1, error: fetchError1 }, { data: pos2, fetchError2 }] =
			await Promise.all(original);

		if (fetchError1) console.warn(fetchError1.message);
		if (fetchError2) console.warn(fetchError2.message);

		// swaps them
		const updates = [
			supabase.from("habit").update({ order: pos2[0].order }).eq("id", id1),
			supabase.from("habit").update({ order: pos1[0].order }).eq("id", id2),
		];

		const [{ error: updateError1 }, { error: updateError2 }] =
			await Promise.all(updates);

		if (updateError1) console.warn(updateError1.message);
		if (updateError2) console.warn(updateError2.message);
	};

	return (
		<div className="flex flex-col ">
			<h1 className="text-[40px] font-bold">Habit Tracker</h1>
			<StyledButton
				onClick={() => navigate("/settings")}
				content={"Edit Habits"}
			/>
			<StyledButton onClick={handleSignOut} content={"Sign Out"} />
			<div className="flex flex-col gap-8">
				<DndContext
					collisionDetection={closestCorners}
					onDragEnd={handleDragEnd}
					sensors={sensors}
				>
					<SortableContext
						items={shuukanData.map((habit) => habit.id)}
						strategy={verticalListSortingStrategy}
					>
						{shuukanData
							.filter((shuukan) => shuukan.visible)
							.map((habit) => (
								<div
									key={habit.id}
									className="hover:brightness-75 cursor-pointer"
									onClick={() => navigate("/habit?habit_id=" + habit.id)}
								>
									<HabitContextProvider habit={habit} key={habit.id}>
										<HabitTracker />
									</HabitContextProvider>
								</div>
							))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}
