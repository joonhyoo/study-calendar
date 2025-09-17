import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from 'src/components/StyledButton';
import AppContext from 'src/contexts/AppContextProvider';

export default function Login() {
  const { signInWithGitHub, signInWithOAuth, claims } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (claims) {
      navigate('/home');
    }
  }, [navigate, claims]);

  return (
    <div className="bg-[#212121] flex flex-col justify-center p-[24px] gap-[32px]">
      <div>
        <h1 className="text-[40px] font-bold w-full">Habit Tracker</h1>
        <p>sign in to continue</p>
      </div>
      <div className="flex flex-col gap-[16px]">
        <button
          className="hover:cursor-pointer hover:brightness-75 flex gap-4 justify-center items-center py-[8px] bg-[#323334]"
          onClick={() => signInWithOAuth('Google')}
        >
          Sign in with Google
          <img
            className="size-[16px]"
            alt="Google logo"
            src="/google-logo.png"
          />
        </button>
        <button
          className="hover:cursor-pointer hover:brightness-75 flex gap-4 justify-center items-center py-[8px] bg-[#323334]"
          onClick={signInWithGitHub}
        >
          Sign in with GitHub
          <img
            className="size-[16px]"
            alt="GitHub logo"
            src="/white-github-logo.png"
          />
        </button>
      </div>
    </div>
  );
}
