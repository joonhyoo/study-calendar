import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "react-router-dom";
import { customDateFormat, getLocalToday } from "src/utils/helpers";
import supabase from "src/services/supabase";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [claims, setClaims] = useState(null);
  const [shuukanData, setShuukanData] = useState(null);
  const [dates, setDates] = useState([]);
  const appRef = useRef(null);
  const [localToday, setLocalToday] = useState(getLocalToday());

  // fetches Habits, Corresponding Materials, and their Records
  const fetchAll = async () => {
    const { data, error } = await supabase.from("habit").select(
      `
          title,
          id,
          hexcode,
          visible,
          order,
          habit_material (
            title,
            description,
            id,
            visible,
            habit_records (
              created_on,
              count
            )
          )
        `
    );
    if (error) {
      console.warn(error?.message);
      return null;
    }
    return data;
  };

  // fetches object of materialId : total for all materials under habit_id
  const fetchTotals = (habit_id) => {
    return supabase
      .from("habit")
      .select(
        `
          title,
          id,
          habit_material(habit_records(created_on, count))
        `
      )
      .eq("id", habit_id)
      .then((res) => {
        const recordsObj = {};
        res.data
          .flatMap((x) => x.habit_material)
          .flatMap((y) => y.habit_records)
          .forEach((r) => {
            // if perfomance becomes an issue, truncate dates from here
            if (recordsObj[r.created_on]) {
              recordsObj[r.created_on] += r.count;
            } else {
              recordsObj[r.created_on] = r.count;
            }
          });
        return recordsObj;
      });
  };

  // fetches object of materialId : count
  const fetchMaterialTotals = async (materialId) => {
    const { data, error } = await supabase
      .from("habit_records")
      .select("*")
      .eq("material_id", materialId);
    if (error) console.error(error);
    const totalsObj = {};
    data.forEach((record) => totalsObj[record.created_on] === record.count);
    return totalsObj;
  };

  const loadShuukanData = useCallback(async () => {
    const fetchedData = await fetchAll();
    const sortedData = fetchedData.sort((a, b) => a.order - b.order);
    const stringifyData = JSON.stringify(sortedData);

    const sessionData = sessionStorage.getItem("shuukan-data");
    if (sessionData !== null && stringifyData === sessionData) {
      console.log("data same");
      setShuukanData(JSON.parse(sessionData));
    } else {
      console.log("data different");
      sessionStorage.setItem("shuukan-data", stringifyData);
      setShuukanData(fetchedData);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        claims,
        fetchTotals,
        fetchMaterialTotals,
        dates,
        shuukanData,
        loadShuukanData,
        setShuukanData,
        localToday,
      }}
    >
      <div
        ref={appRef}
        className="flex flex-col text-center items-center" /*className="max-w-[430px] m-auto px-[32px] py-[64px]"*/
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};

export { AppContext as default, AppContextProvider };
