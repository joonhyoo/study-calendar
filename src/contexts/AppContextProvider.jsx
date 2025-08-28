import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { customDateFormat } from 'src/utils/helpers';
import supabase from 'src/utils/supabase';

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availCols, setAvailCols] = useState(0);
  const appRef = useRef(null);

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
    await supabase.auth.signOut();
  };

  useEffect(() => {
    session ? setIsLoading(false) : setIsLoading(true);
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        session,
        isLoading,
        habits,
        fetchTotals,
        fetchHabits,
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
