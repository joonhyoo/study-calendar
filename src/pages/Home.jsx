import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import DateBox from '../DateBox/DateBox';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currRecord, setCurrRecord] = useState(null);

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
    // check session storage
    // if exists => pull that data
    const storedRecords = sessionStorage.getItem('records');
    if (storedRecords) {
      setRecords(storedRecords);
    } else {
      // else fetches session storage records
      supabase.functions
        .invoke('fetch-study-records')
        .then((res) => setRecords(res.data.sortedList))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div id="main-container">
      <h1>japanese learning calendar</h1>
      {user ? (
        <>
          <p>You are logged in as {user.email}</p>
          <button onClick={() => navigate('/profile')}>Go to Profile</button>
          <button onClick={signOut}>Sign Out</button>
          <div id="study-table">
            {records.map((data, index) => (
              <DateBox key={index} data={data} setCurrRecord={setCurrRecord} />
            ))}
          </div>
          {currRecord && (
            <div>
              <h1>{currRecord.study_date}</h1>
              {currRecord.records.map((record) => (
                <div>
                  {record.title} {record.count}
                </div>
              ))}
            </div>
          )}
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
