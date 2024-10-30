import { Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import Layout from '../layout';
import { VariableSizeList } from '@/components';
import Demo from '@/components/Demo';

const Redirect = ({ to }) => <Navigate to={to} replace />;

const Up = loadable(() => import(/* webpackChunkName: "up" */ '@/components/up/'));

export const ROUTES = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Redirect to="variable-size-list" />,
      },
      {
        path: 'variable-size-list',
        // element: <VariableSizeList />,
        element: <Demo />,
        
      },
      {
        path: 'pull-load-for-more',
        Component: Up,
      },
      {
        path: '*',
        element: <Redirect to="variable-size-list" />,
      },
    ],
  },
];
