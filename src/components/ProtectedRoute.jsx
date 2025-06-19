import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/sessionUtils';

const ProtectedRoute = ({ children }) => {
  const session = getSession();

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;