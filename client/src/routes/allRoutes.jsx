import React from 'react';
import { Navigate } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import ChartOfAccounts from '../pages/ChartOfAccounts';
import CreateTransaction from '../pages/CreateTransaction';
import CreateBill from '../pages/CreateBill';
import ConnectionSuccess from '../pages/ConnectionSuccess';

const authProtectedRoutes = [
  { path: '/', component: <ChartOfAccounts /> },
  { path: '/create-transaction', component: <CreateTransaction /> },
  { path: '/create-bill', component: <CreateBill /> },
  { path: '*', component: <Navigate to="/" /> },
];

const publicRoutes = [
  { path: '/signin', component: <SignIn /> },
  { path: '/success', component: <ConnectionSuccess /> },
];

export { authProtectedRoutes, publicRoutes };
