import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, useRoutes } from 'react-router-dom';
import { ROUTES } from './route';

import './index.css';

const App = () => {
  return <div>{useRoutes(ROUTES)}</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter basename="/">
      <App />  
    </HashRouter>
  </StrictMode>,
)
