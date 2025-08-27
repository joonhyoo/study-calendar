import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContextProvider';

function PrivateRoute({ element }) {
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

  if (user) {
    return element;
  } else {
    return <Navigate to={'/login'} replace />;
  }
}

export default PrivateRoute;
