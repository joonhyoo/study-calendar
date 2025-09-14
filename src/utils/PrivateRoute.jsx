import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

function PrivateRoute() {
  const { claims } = useContext(AppContext);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (claims) return;

    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [claims, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(
        <h3>
          If this takes a while click <Link to={'/login'}>here</Link>
        </h3>
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (claims === null) {
    return (
      <div>
        <h1>Loading...</h1>
        {message}
      </div>
    );
  }
  return <Outlet />;
}

export default PrivateRoute;
