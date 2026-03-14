import { Link } from "react-router-dom";
import { useAuthStore } from "src/stores/authStore";

const Header = ({ isSignIn, isSignOut }) => {
  const signOut = useAuthStore((state) => state.signOut);
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-[#232320] w-full">
      <a href="/" className="font-serif text-xl text-[#e8e4dc] no-underline">
        Shu<em className="italic text-[#c8622a]">u</em>
      </a>
      {isSignIn && (
        <Link
          to="/login"
          className="text-xs tracking-widest uppercase text-[#5a5a52] no-underline hover:text-[#e8e4dc] duration-250"
        >
          Sign in →
        </Link>
      )}
      {isSignOut && (
        <Link
          to="/"
          onClick={signOut}
          className="text-xs tracking-widest uppercase text-[#5a5a52] no-underline hover:text-[#e8e4dc] duration-250"
        >
          ↩ Sign Out
        </Link>
      )}
    </nav>
  );
};
export default Header;
