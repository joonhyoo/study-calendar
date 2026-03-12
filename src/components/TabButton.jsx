import { NavLink } from "react-router-dom";

const TabButton = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      role="tab"
      aria-selected={({ isActive }) => isActive}
      tabIndex={0}
      className={({ isActive }) =>
        `flex-1 py-2 rounded-xl font-semibold transition-all duration-200 text-center
         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
         ${
           isActive
             ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/50"
             : "bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white hover:shadow-md"
         }`
      }
    >
      {label}
    </NavLink>
  );
};

export default TabButton;
