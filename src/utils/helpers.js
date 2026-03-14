export const getLocalToday = () => {
  const today = new Date();
  const currYear = today.getFullYear();
  const currMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currDate = String(today.getDate()).padStart(2, "0");
  return currYear + "-" + currMonth + "-" + currDate;
};

export const customDateFormat = (inputDate) => {
  const currYear = inputDate.getFullYear();
  const currMonth = String(inputDate.getMonth() + 1).padStart(2, "0");
  const currDate = String(inputDate.getDate()).padStart(2, "0");
  return currYear + "-" + currMonth + "-" + currDate;
};

export const findMaxObj = (itemsObj) => {
  return Math.max(...Object.values(itemsObj));
};

export const PRESET_COLORS = [
  "#c8622a",
  "#7bcaff",
  "#FF7B88",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
];
