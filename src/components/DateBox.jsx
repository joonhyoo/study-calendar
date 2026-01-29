import { useContext } from "react";
import HabitContext from "src/contexts/HabitContextProvider";

function DateBox({ ratio, hexCode, size }) {
	const { habit } = useContext(HabitContext);
	return (
		<div
			className="rounded-[3px]"
			style={{
				height: size || 12,
				width: size || 12,
				opacity: ratio === 0 ? 1 : ratio,
				backgroundColor: ratio === 0 ? "#3f3f3f" : habit?.hexCode || hexCode,
			}}
		/>
	);
}

export default DateBox;
