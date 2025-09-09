import { createContext } from 'react';

const HabitContext = createContext({});

const HabitContextProvider = ({ children, habit, newHabit }) => {
  return (
    <HabitContext.Provider value={{ habit, newHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export { HabitContext as default, HabitContextProvider };
