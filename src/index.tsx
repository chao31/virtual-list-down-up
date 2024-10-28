import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ROUTES } from './route';

import './index.css';

const App = () => {
  return <div>{useRoutes(ROUTES)}</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <App />  
    </BrowserRouter>
  </StrictMode>,
)
