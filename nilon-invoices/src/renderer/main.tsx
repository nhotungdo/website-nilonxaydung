import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { TranslationProvider } from './locales';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TranslationProvider>
        <AppRouter />
      </TranslationProvider>
    </ErrorBoundary>
  </React.StrictMode>
);



