import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/core.scss';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './contexts/AuthContext.js';
import { apolloClient } from './lib/apolloClient.js';
import App from './App.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={apolloClient}>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </ApolloProvider>
);
