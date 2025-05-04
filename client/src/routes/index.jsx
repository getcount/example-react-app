import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { authProtectedRoutes, publicRoutes } from './allRoutes';
import { AuthProtected } from './AuthProtected';

const AllRoutes = () => (
  <Routes>
    <Route>
      {authProtectedRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={
            // route.component
            <AuthProtected location={route.path}>
              {route.component}
            </AuthProtected>
          }
          key={idx}
          exact
        />
      ))}
      {publicRoutes.map((route, idx) => (
        <Route path={route.path} element={route.component} key={idx} exact />
      ))}
    </Route>
  </Routes>
);

export default AllRoutes;
