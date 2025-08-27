import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

function PrivateRoute() {
  const { user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to={'/login'} replace />;
}

export default PrivateRoute;
