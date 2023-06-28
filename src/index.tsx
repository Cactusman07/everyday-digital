import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app';
import client from './apollo';
import { ApolloProvider } from '@apollo/client';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

/* StrictMode is a tool for highlighting potential problems in an application 
   We’re just using it here to help debug issues. StrictMode checks are run in 
   development mode only and don’t impact production builds
*/