import { useAuthStore } from "src/stores/authStore";
import Header from "src/components/Header";

const AuthButton = ({ provider, logoSrc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-3 w-full py-3 px-5 bg-transparent border border-[#232320] text-[#5a5a52] text-[0.72rem] tracking-widest uppercase hover:border-[#c8622a] hover:text-[#e8e4dc] transition-all cursor-pointer"
  >
    <img className="w-4 h-4" alt={`${provider} logo`} src={logoSrc} />
    Sign in with {provider}
  </button>
);

export default function Login() {
  const signInWithProvider = useAuthStore((state) => state.signInWithProvider);

  const providers = [
    { name: "Google", logo: "/google-logo.png" },
    { name: "GitHub", logo: "/white-github-logo.png" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0d] flex flex-col items-center justify-between w-full">
      <Header isSignIn />
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c8622a] mb-3">
            Habit Tracking
          </p>
          <h1 className="font-serif text-5xl tracking-tight text-[#e8e4dc] leading-none mb-2">
            Shu<em className="italic text-[#c8622a]">u</em>
          </h1>
          <p className="text-[0.75rem] text-[#5a5a52] tracking-wide">
            Sign in to continue
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {providers.map((p) => (
            <AuthButton
              key={p.name}
              provider={p.name}
              logoSrc={p.logo}
              onClick={() => signInWithProvider(p.name.toLowerCase())}
            />
          ))}
        </div>
      </div>
      {/* Footer */}
      <p className="py-6 text-xs text-[#3a3a38] text-center">
        By signing in you agree to our{" "}
        <a
          href="/privacy-policy"
          className="text-[#5a5a52] hover:text-[#c8622a] transition-colors no-underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
