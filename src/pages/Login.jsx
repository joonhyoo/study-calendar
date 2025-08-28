import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';
import 'src/styles/Login.css';

export default function Login() {
  const { signInWithGitHub, session } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [navigate, session]);

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
