import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';

export default function Home({ user }) {
  const navigate = useNavigate();

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    console.log('data:', data);
    console.log('error:', error);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchStudyRecords = async () => {
      const { data, error } = await supabase.from('study_records').select('*');
      console.log(data);
      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setRecords(data);
      }
      ``;
      console.log(records);
    };
    fetchStudyRecords();
  }, []);

  return (
    <div id="main-container">
      <h1>japanese learning calendar</h1>
      {user ? (
        <>
          <p>You are logged in as {user.email}</p>
          <button onClick={() => navigate('/profile')}>Go to Profile</button>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <div id="login-popup">
          <h1 className="mini-logo">:&#62;</h1>
          <p id="sign-in-text">sign in to continue</p>
          <button id="login-button" onClick={signInWithGitHub}>
            Sign In with GitHub
            <img
              id="github-logo-img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png?20180806170715"
            />
          </button>
        </div>
      )}
    </div>
  );
}
