import { Link } from "react-router-dom";

const BasicNav = () => {
  return (
    <nav className="absolute top-0 flex justify-between items-center px-10 py-6 border-b border-[#232320] w-full">
      <a href="/" className="font-serif text-xl text-[#e8e4dc] no-underline">
        Shu<em className="italic text-[#c8622a]">u</em>
      </a>
      <Link
        to="/login"
        className="text-[0.7rem] tracking-widest uppercase text-[#5a5a52] no-underline hover:text-[#e8e4dc] transition-colors"
      >
        Sign in →
      </Link>
    </nav>
  );
};
export default BasicNav;
