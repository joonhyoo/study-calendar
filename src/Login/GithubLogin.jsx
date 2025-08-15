import supabase from '../utils/supabase';
import './GithubLogin.css';

export default function GithubLogin() {
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
