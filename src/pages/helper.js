// storing my helpers that are meant to be edge functions here until i can get it fixed
const getLatest = (today) => {
  const res = {};
  const curr = new Date(today);
  for (let x = 0; x < 200; x++) {
    const temp = curr.toISOString().split("T")[0];
    res[temp] = [];
    curr.setDate(curr.getDate() - 1);
  }
  return res;
};

export const formatData = (data, today) => {
  const habits = data;
  const res = [];
  for (const habit of habits) {
    const records = [];
    const latest = getLatest(today);
    for (const material of habit["habit_material"]) {
      for (const task of material["habit_records"]) {
        if (!latest[task.created_on]) continue;
        latest[task.created_on].push({
          title: material.title,
          count: task.count,
        });
      }
    }
    for (const day in latest) {
      const items = latest[day];
      const total = items.reduce((sum, record) => sum + record.count, 0);
      records.push({ created_on: day, items, total });
    }
    records.sort((a, b) => Date.parse(a.created_on) - Date.parse(b.created_on));
    console.log(records);
    const finalHabit = {
      title: habit.title,
      id: habit.id,
      rgbColor: habit.rgbColor,
      records: records,
    };
    res.push(finalHabit);
  }
  return res;
};
