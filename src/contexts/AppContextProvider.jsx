import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { redirect } from 'react-router-dom';
import { customDateFormat } from 'src/utils/helpers';
import supabase from 'src/utils/supabase';

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [claims, setClaims] = useState(null);
  const [shuukanData, setShuukanData] = useState(null);
  const [dates, setDates] = useState([]);
  const [availCols, setAvailCols] = useState(0);
  const appRef = useRef(null);

  // fetches Habits, Corresponding Materials, and their Records
  const fetchAll = async () => {
    const { data, error } = await supabase.from('habit').select(
      `
          title,
          id,
          hexCode,
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
      .from('habit')
      .select(
        `
          title,
          id,
          habit_material(habit_records(created_on, count))
        `
      )
      .eq('id', habit_id)
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
      .from('habit_records')
      .select('*')
      .eq('material_id', materialId);
    if (error) console.error(error);
    const totalsObj = {};
    data.forEach((record) => (totalsObj[record.created_on] = record.count));
    return totalsObj;
  };

  // on resize, updates avail cols for tracker calendars
  useEffect(() => {
    const handleResize = () => {
      if (!appRef.current) return;
      const outterPadding = 32 * 2;
      const innerPadding = 24 * 2;
      const currWidth =
        appRef.current.clientWidth - outterPadding - innerPadding;
      const boxSize = 12;
      const gap = 4;
      setAvailCols(
        Math.max(1, Math.floor((currWidth - boxSize) / (boxSize + gap)) + 1)
      );
    };
    const resizeObserver = new ResizeObserver(() => {
      if (appRef.current) {
        handleResize();
      }
    });
    resizeObserver.observe(appRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // generates necessary array of dates in accordance with avail Cols
  useEffect(() => {
    const createDates = () => {
      const tempDates = [];
      const curr = new Date();
      const rows = 7;
      for (let x = 0; x < rows * availCols; x++) {
        tempDates.unshift(customDateFormat(curr));
        curr.setDate(curr.getDate() - 1);
      }
      setDates(tempDates);
    };
    createDates();
  }, [availCols]);

  const signInWithOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      console.error(provider, 'login failed:', error.message);
    }
  };

  // signs in with Github Oauth, but may implement more in future
  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) {
      console.error('GitHub login failed:', error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setClaims(null);
    sessionStorage.removeItem('shuukan-data');
    if (error) {
      console.warn('Sign out error:', error.message);
    }
  };

  const loadShuukanData = useCallback(async () => {
    const fetchedData = await fetchAll();
    const sortedData = fetchedData.sort((a, b) => a.order - b.order);
    const stringifyData = JSON.stringify(sortedData);

    const sessionData = sessionStorage.getItem('shuukan-data');
    if (sessionData !== null && stringifyData === sessionData) {
      console.log('data same');
      setShuukanData(JSON.parse(sessionData));
    } else {
      console.log('data different');
      sessionStorage.setItem('shuukan-data', stringifyData);
      setShuukanData(fetchedData);
    }
  }, []);

  // authorizes user through supabase auth then loads data
  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        console.warn('Error verifying user:', error?.message);
        redirect('/login');
      } else {
        setClaims(data.claims);
        loadShuukanData();
      }
    };
    verifyUser();
  }, [loadShuukanData]);

  const getTimeTillMidnight = () => {
    const now = new Date();
    const midnight = new Date().setHours(24, 0, 0, 0);
    return midnight - now;
  };

  // on mount set timer => at midnight, force fetch
  useEffect(() => {
    const remainingTime = getTimeTillMidnight();
    console.log(`Time until midnight: ${remainingTime} ms`);

    const timer = setTimeout(() => {
      loadShuukanData();
    }, remainingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [loadShuukanData]);

  return (
    <AppContext.Provider
      value={{
        claims,
        fetchTotals,
        fetchMaterialTotals,
        dates,
        signInWithGitHub,
        signInWithOAuth,
        signOut,
        shuukanData,
        loadShuukanData,
        setShuukanData,
      }}
    >
      <div ref={appRef} className="max-w-[430px] m-auto px-[32px] py-[64px]">
        {children}
      </div>
    </AppContext.Provider>
  );
};

export { AppContext as default, AppContextProvider };
