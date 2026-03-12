import { useState } from "react";
import { useAuthStore } from "src/stores/authStore";

const AuthButton = ({ provider, logoSrc, onClick }) => (
  <button
    className="hover:cursor-pointer hover:brightness-75 flex gap-4 justify-center items-center py-2 px-4 bg-[#323334] rounded-md"
    type="button"
    onClick={onClick}
  >
    Sign in with {provider}
    <img className="w-4 h-4" alt={`${provider} logo`} src={logoSrc} />
  </button>
);

export default function Login() {
  const signInWithProvider = useAuthStore((state) => state.signInWithProvider);

  const providers = [
    { name: "Google", logo: "/google-logo.png" },
    { name: "GitHub", logo: "/white-github-logo.png" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-[#2b2b2b] rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-white">Habit Tracker</h1>
        <p className="text-gray-300 mt-2 mb-6">Sign in to continue</p>

        <div className="flex flex-col gap-4">
          {providers.map((p) => (
            <AuthButton
              key={p.name}
              provider={p.name}
              logoSrc={p.logo}
              onClick={() => signInWithProvider(p.name)}
            >
              {p.name}
            </AuthButton>
          ))}
        </div>
      </div>
    </div>
  );
}
