import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { StyledButton } from "src/components/StyledButton";
import { useAuthStore } from "src/stores/authStore";
import AppContext from "src/contexts/AppContextProvider";

export default function Home() {
  const [activeTab, setActiveTab] = useState("today");
  const { loadShuukanData } = useContext(AppContext);
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(activeTab);
  }, [navigate, activeTab]);

  useEffect(() => {
    loadShuukanData();
  }, [loadShuukanData]);

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-[40px] font-bold">Habit Tracker</h1>
      <StyledButton onClick={() => signOut()} content={"Sign Out"} />
      {/* Code taken from Figma Make => transcribed to react using ChatGPT */}
      <div role="tablist" className="flex justify-center gap-3">
        <button
          role="tab"
          type="button"
          aria-selected={activeTab === "today"}
          onClick={() => setActiveTab("today")}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:cursor-pointer ${
            activeTab === "today"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg"
          }`}
        >
          Today
        </button>

        <button
          role="tab"
          type="button"
          aria-selected={activeTab === "progress"}
          onClick={() => setActiveTab("progress")}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:cursor-pointer ${
            activeTab === "progress"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg"
          }`}
        >
          Progress
        </button>

        <button
          role="tab"
          type="button"
          aria-selected={activeTab === "manage"}
          onClick={() => setActiveTab("manage")}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:cursor-pointer ${
            activeTab === "manage"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg"
          }`}
        >
          Manage
        </button>
      </div>
      <Outlet />
    </div>
  );
}
