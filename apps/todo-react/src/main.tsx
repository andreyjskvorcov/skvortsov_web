import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { syncTheme } from './theme';
import './style.css';

syncTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
