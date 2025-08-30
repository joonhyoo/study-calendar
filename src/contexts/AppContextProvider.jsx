import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { redirect } from 'react-router-dom';
import { customDateFormat } from 'src/utils/helpers';
import supabase from 'src/utils/supabase';

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [claims, setClaims] = useState(null);
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availCols, setAvailCols] = useState(0);
  const appRef = useRef(null);

  // fetches user habits
  const fetchHabits = useCallback(() => {
    supabase
      .from('habit')
      .select(
        `
          title,
          id,
          rgbColor
        `
      )
      .then((res) => setHabits(res.data));
  }, []);

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
      const currWidth = appRef.current.clientWidth - 64;
      setAvailCols(Math.max(1, Math.floor((currWidth - 12) / (12 + 4)) + 1));
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
    if (error) {
      console.warn('Sign out error:', error.message);
    }
  };

  // loading for middleware to determine user authorization
  useEffect(() => {
    claims ? setIsLoading(false) : setIsLoading(true);
  }, [claims]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // authorizes user through supabase auth
  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        console.warn('Error verifying user:', error?.message);
        redirect('/login');
      } else {
        setClaims(data.claims);
      }
    };
    verifyUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        claims,
        isLoading,
        habits,
        fetchTotals,
        fetchHabits,
        fetchMaterialTotals,
        dates,
        signInWithGitHub,
        signOut,
      }}
    >
      <div id="app-container" ref={appRef}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export { AppContext as default, AppContextProvider };
