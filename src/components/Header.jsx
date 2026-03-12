import { Link } from "react-router-dom";
import { useAuthStore } from "src/stores/authStore";

const Header = ({ isSignIn }) => {
  const signOut = useAuthStore((state) => state.signOut);
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-[#232320] w-full">
      <a href="/" className="font-serif text-xl text-[#e8e4dc] no-underline">
        Shu<em className="italic text-[#c8622a]">u</em>
      </a>
      {isSignIn ? (
        <Link
          to="/login"
          className="text-[0.7rem] tracking-widest uppercase text-[#5a5a52] no-underline hover:text-[#e8e4dc] transition-colors"
        >
          Sign in →
        </Link>
      ) : (
        <button
          onClick={signOut}
          className="text-sm text-gray-400 px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition"
        >
          ↩ Sign Out
        </button>
      )}
    </nav>
  );
};
export default Header;
