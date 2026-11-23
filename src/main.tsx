import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import './styles/fonts.css';
import './styles/variables.css';
import './styles/globals.css';
import { App } from './App';
import './styles/app.css';

const root = document.getElementById('root');
if (!root) throw new Error('The React root element is missing.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
