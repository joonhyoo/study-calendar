import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

export default function Login() {
  const { signInWithGitHub, claims } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (claims) {
      navigate('/home');
    }
  }, [navigate, claims]);

  return (
    <div id="login-popup">
      <div>
        <h1>Habit Tracker</h1>
        <p>sign in to continue</p>
      </div>
      <button
        id="login-button"
        className="clickable"
        onClick={signInWithGitHub}
      >
        Sign in with GitHub
        <img
          id="github-logo-img"
          alt="GitHub logo"
          src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        />
      </button>
    </div>
  );
}
