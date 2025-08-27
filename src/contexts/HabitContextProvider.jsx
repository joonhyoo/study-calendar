import { createContext } from 'react';

const HabitContext = createContext({});

const HabitContextProvider = ({ children, habit }) => {
  return (
    <HabitContext.Provider value={{ habit }}>{children}</HabitContext.Provider>
  );
};

export { HabitContext as default, HabitContextProvider };
