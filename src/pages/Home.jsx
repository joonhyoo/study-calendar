import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import DateBox from '../DateBox/DateBox';
import GithubLogin from '../Login/GithubLogin';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currRecord, setCurrRecord] = useState(null);

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // check session storage
    const storedRecords = sessionStorage.getItem('records');
    // if exists => pull that data
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
        <GithubLogin />
      )}
    </div>
  );
}
