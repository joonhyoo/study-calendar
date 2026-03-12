import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BasicNav from "src/components/BasicNav";

const Homepage = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0d] text-[#e8e4dc] flex flex-col items-center w-full">
      <BasicNav />
      {/* Hero */}
      <main
        className={`flex-1 flex flex-col justify-center px-10 py-24 max-w-2xl transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c8622a] mb-7">
          The Habit Tracking App
        </p>
        <h1 className="text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-tight text-[#e8e4dc] mb-7">
          Build habits
          <br />
          that <em className="italic text-[#c8622a]">stick.</em>
        </h1>
        <p className="text-[0.82rem] leading-loose text-[#5a5a52] max-w-sm mb-10">
          Shuu is a simple, focused habit tracker. Log your daily habits, and
          get 1% better every day.
        </p>
        <Link
          to="/login"
          className="inline-block text-[0.72rem] tracking-widest uppercase no-underline bg-[#c8622a] text-[#0e0e0d] px-7 py-3 border border-[#c8622a] hover:bg-transparent hover:text-[#c8622a] transition-all"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232320] px-10 py-5 flex justify-between items-center text-[0.65rem] tracking-wider text-[#5a5a52] w-full">
        <span>© {new Date().getFullYear()} Shuu</span>
        <Link
          to="/privacy-policy"
          className="text-[#5a5a52] no-underline hover:text-[#c8622a] transition-colors"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
};

export default Homepage;
