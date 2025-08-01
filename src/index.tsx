import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { AppContextProvider } from './context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppContextProvider>
      <ThemeProvider
        theme={theme}
      >
        <QueryClientProvider
          client={queryClient}
        >
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </AppContextProvider>
  </React.StrictMode>
);
