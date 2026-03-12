import { Outlet } from "react-router-dom";
import TabButton from "src/components/TabButton";
import Header from "src/components/Header";

// tabs outside component stops it being recreated every time
const tabs = Object.freeze([
  { id: "today", label: "Today" },
  { id: "progress", label: "Progress" },
  { id: "manage", label: "Manage" },
]);

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <Header />
      <nav
        role="tablist"
        className="flex justify-center gap-3"
        aria-label="Habit tracker sections"
      >
        {tabs.map((tab) => (
          <TabButton key={tab.id} to={tab.id} label={tab.label} />
        ))}
      </nav>
      <main role="tabpanel">
        <Outlet />
      </main>
    </div>
  );
}
