import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { TranslationProvider } from './locales';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TranslationProvider>
      <AppRouter />
    </TranslationProvider>
  </React.StrictMode>
);

