import { useContext, useEffect } from 'react';
import supabase from 'src/utils/supabase';
import AppContext from 'src/contexts/AppContextProvider';
import 'src/styles/Login.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home');
  }, [navigate, user]);

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    console.log('data:', data);
    console.log('error:', error);
  };
  return (
    <div id="login-popup">
      <h1 className="mini-logo">:&#62;</h1>
      <p id="sign-in-text">sign in to continue</p>
      <button id="login-button" onClick={signInWithGitHub}>
        Sign In with GitHub
        <img
          id="github-logo-img"
          src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        />
      </button>
    </div>
  );
}
