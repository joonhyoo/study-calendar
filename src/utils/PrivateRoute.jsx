import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

function PrivateRoute() {
  const { isLoading } = useContext(AppContext);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(
        <h3>
          If this takes a while click <Link to={'/login'}>here</Link>
        </h3>
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
