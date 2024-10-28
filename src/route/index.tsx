import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../layout';

// const Redirect = ({ to }) => <Navigate to={to} replace />;

// const Not404 = loadable(() => import(/* webpackChunkName: "not404" */ '@/pages/404'));
// const Blank = loadable(() => import(/* webpackChunkName: "blank" */ '@/pages/blank'));

export const ROUTES = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // {
      //   path: '',
      //   element: <Redirect to="/search" />,
      // },
      // {
      //   path: 'search',
      //   element: <Ai />,
      // },
      // {
      //   path: '404',
      //   Component: Not404,
      // },
      // {
      //   path: 'blank',
      //   Component: Blank,
      // },
    ],
  },
];
