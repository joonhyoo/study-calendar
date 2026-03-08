import { useContext, useEffect, useState } from "react";
import AppContext from "src/contexts/AppContextProvider";
import HabitContext from "src/contexts/HabitContextProvider";
import { findMaxObj } from "src/utils/helpers";
import { HabitRing } from "./HabitRing";
import { StyledButton } from "./StyledButton";

function HabitUpdater({ material, updateChanges, todayCount, goal = 1 }) {
	const { dates, shuukanData, localToday } = useContext(AppContext);
	const done = todayCount >= goal;
	const { habit } = useContext(HabitContext);
	const [localTotals, setLocalTotals] = useState({});
	const [max, setMax] = useState(0);
	const [records, setRecords] = useState([]);

	useEffect(() => {
		if (!shuukanData) return;
		const createRecords = () => {
			const shuukan = shuukanData.find((shuukan) => shuukan.id === habit.id);
			const materials = shuukan.habit_material;
			const rec = {};
			materials
				.find((m) => m.id === material.id)
				.habit_records.forEach(
					(record) => rec[record.created_on] === record.count,
				);
			return rec;
		};
		setRecords(createRecords());
	}, [habit.id, material.id, shuukanData]);

	// when page resize, or records change
	// update localTotals and max
	useEffect(() => {
		const shortDates = dates.slice(-dates.length / 7);
		const shortTotals = shortDates.reduce((res, date) => {
			res[date] = date === localToday ? todayCount : records?.[date] || 0;
			return res;
		}, {});
		setLocalTotals(shortTotals);
		setMax(findMaxObj(shortTotals));
	}, [dates, localToday, records, todayCount]);

	const handlePlus = () => {
		updateChanges(material.id, todayCount + 1);
	};

	const handleMinus = () => {
		updateChanges(material.id, todayCount > 0 ? todayCount - 1 : 0);
	};

	return (
		habit && (
			<div className="bg-[#323334] flex flex-col gap-[16px] items-center p-[24px]">
				<div className="relative">
					<HabitRing
						count={todayCount}
						goal={goal}
						color={habit.hexCode}
						size={100}
						stroke={12}
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span
							className="text-3xl font-[600] ease-in-out duration-250"
							style={{
								color: done ? habit.hexCode : "#fff",
							}}
						>
							{todayCount}
						</span>
						<span
							style={{
								fontFamily: "'DM Mono', monospace",
								fontSize: 13,
								color: "rgba(255,255,255,0.35)",
								letterSpacing: "0.05em",
							}}
						>
							/ {goal}
						</span>
					</div>
				</div>

				<h4 className="text-[20px] font-[700]">{material.title}</h4>
				<div className={"flex flex-col justify-center"}>
					<button
						onClick={handlePlus}
						type="button"
						disabled={done}
						className="rounded-xl px-7 py-3 text-md font-[700] tracking-wider ease duration-250 w-full"
						style={{
							background: done ? `${habit.hexCode}22` : habit.hexCode,
							color: done ? habit.hexCode : "#000",
							cursor: done ? "default" : "pointer",
							opacity: done ? 0.6 : 1,
						}}
					>
						{done ? "Done!" : "Log +1"}
					</button>
				</div>
			</div>
		)
	);
}

export default HabitUpdater;
