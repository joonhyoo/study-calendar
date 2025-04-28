import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile({ user }) {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/')}>Go back home</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
