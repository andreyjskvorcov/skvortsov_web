import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { syncTheme } from '@skvortsov/shared/theme';
import './style.css';

syncTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
