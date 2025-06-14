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
      const { data, error } = await supabase
        .from('study_records')
        .select(`study_date, count, study_material(title)`);

      if (error) {
        console.error('Error fetching records:', error);
      } else {
        const test = [];
        const curr = new Date();
        for (let x = 0; x < 300; x++) {
          const temp = { study_date: curr.toISOString().split('T')[0] };
          test.push(temp);
          curr.setDate(curr.getDate() - 1);
        }

        const flatData = data.map((item) => ({
          study_date: item.study_date,
          count: item.count,
          title: item.study_material?.title ?? null,
        }));

        // Step 1: Convert grouped data to a map for fast lookup
        const groupedMap = {};

        flatData.forEach(({ study_date, title, count }) => {
          if (!groupedMap[study_date]) {
            groupedMap[study_date] = [];
          }
          groupedMap[study_date].push({ title, count });
        });

        // Step 2: Create merged array using the 300-day test list
        const merged = test.map(({ study_date }) => {
          const records = groupedMap[study_date] ?? [];
          const total = records.reduce((sum, record) => sum + record.count, 0);

          return {
            study_date,
            records,
            total,
          };
        });
        console.log(merged);
        setRecords(merged);
      }
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
          <div id="study-table">
            {records.map((data, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'light-gray',
                  textAlign: 'center',
                  alignContent: 'center',
                  height: '30px',
                  width: '30px',
                }}
              >
                {data.total}
              </div>
            ))}
          </div>
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
