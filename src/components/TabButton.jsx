// TabButton.jsx
import { NavLink } from "react-router-dom";

const TabButton = ({ to, label }) => (
  <NavLink
    to={to}
    role="tab"
    tabIndex={0}
    className={({ isActive }) =>
      `flex-1 py-3 text-center text-xs tracking-[0.18em] uppercase transition-all duration-200
       focus:outline-none
       ${
         isActive
           ? "text-[#e8e4dc] border-b border-[#c8622a]"
           : "text-[#5a5a52] border-b border-transparent hover:text-[#e8e4dc]"
       }`
    }
  >
    {label}
  </NavLink>
);

export default TabButton;
