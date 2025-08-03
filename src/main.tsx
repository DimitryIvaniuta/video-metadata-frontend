import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apolloClient';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);
