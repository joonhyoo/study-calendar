import { Outlet } from "react-router-dom";
import TabButton from "src/components/TabButton";
import Header from "src/components/Header";

// tabs outside component stops it being recreated every time
const tabs = Object.freeze([
  { id: "today", label: "Today" },
  { id: "progress", label: "Progress" },
  { id: "manage", label: "Manage" },
]);

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 pb-8 w-full items-center">
      <Header isSignOut />
      <nav
        role="tablist"
        className="flex justify-center gap-3 px-4 w-full max-w-4xl"
        aria-label="Habit tracker sections"
      >
        {tabs.map((tab) => (
          <TabButton key={tab.id} to={tab.id} label={tab.label} />
        ))}
      </nav>
      <main role="tabpanel" className="w-full max-w-4xl px-4">
        <Outlet />
      </main>
    </div>
  );
}
