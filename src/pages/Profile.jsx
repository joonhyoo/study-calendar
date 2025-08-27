import { useContext } from 'react';
import supabase from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/')}>Go back home</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
