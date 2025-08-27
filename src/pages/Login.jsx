import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import supabase from 'src/utils/supabase';
import AppContext from 'src/contexts/AppContextProvider';
import 'src/styles/Login.css';

export default function Login() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [navigate, user]);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.href,
      },
    });

    if (error) {
      console.error('GitHub login failed:', error.message);
    }
  };

  return (
    <div id="login-popup">
      <h1 className="mini-logo">:&#62;</h1>
      <p id="sign-in-text">sign in to continue</p>
      <button id="login-button" onClick={signInWithGitHub}>
        Sign In with GitHub
        <img
          id="github-logo-img"
          alt="GitHub logo"
          src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        />
      </button>
    </div>
  );
}
