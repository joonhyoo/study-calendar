import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

function PrivateRoute() {
  const { shuukanData } = useContext(AppContext);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (shuukanData) return;

    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [shuukanData, navigate]);

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

  if (shuukanData === null) {
    return (
      <div>
        {message}
      </div>
    );
  }
  return <Outlet />;
}

export default PrivateRoute;
