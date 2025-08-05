import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Always send cookies (for refresh)
const httpLink = createHttpLink({
    uri: '/api/graphql',
    credentials: 'include',
});

// Attach Bearer token to every request
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// On 401 responses, try a refresh (REST), then retry
const errorLink = onError(({ networkError, operation, forward }) => {
    if (
        networkError &&
        'statusCode' in networkError &&
        (networkError as any).statusCode === 401
    ) {
        return fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Refresh failed');
                return res.json();
            })
            .then(({ token: newToken }) => {
                localStorage.setItem('jwtToken', newToken);
                operation.setContext(({ headers = {} }) => ({
                    headers: { ...headers, Authorization: `Bearer ${newToken}` },
                }));
                return forward(operation);
            })
            .catch(() => {
                localStorage.removeItem('jwtToken');
                window.location.href = '/login';
            });
    }
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        // import possibleTypes.json here if you have unions/interfaces
    }),
});
