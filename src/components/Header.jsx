import { useAuthStore } from "src/stores/authStore";

const Header = () => {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <header className="flex items-center justify-between pb-8">
      <h1 className="text-4xl font-bold tracking-wide">Habit Tracker</h1>

      <button
        onClick={signOut}
        className="text-sm text-gray-400 px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition"
      >
        ↩ Sign Out
      </button>
    </header>
  );
};

export default Header;
