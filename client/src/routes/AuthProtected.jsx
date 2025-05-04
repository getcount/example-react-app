import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthProtected = ({ children, location }) => {
  const token = localStorage.getItem('workspaceId');

  if (!token) {
    return <Navigate to={{ pathname: '/signin', state: { from: location } }} />;
  }

  return children;
};

export { AuthProtected };
