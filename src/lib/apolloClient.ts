import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    Observable,
    FetchResult,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// 1) HTTP link
const httpLink = createHttpLink({
    uri: '/api/graphql',
    credentials: 'include',
});

// 2) Auth link
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// 3) Error link with proper Observable return
const errorLink = onError(({ networkError, operation, forward }) => {
    // Only handle 401 Unauthorized
    if (networkError && 'statusCode' in networkError && (networkError as any).statusCode === 401) {
        // Return an Observable that will retry the operation after refresh
        return new Observable<FetchResult>(observer => {
            fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Refresh failed');
                    }
                    return res.json();
                })
                .then((body: { token: string }) => {
                    const { token: newToken } = body;
                    // Persist and update the header for this operation
                    localStorage.setItem('jwtToken', newToken);
                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newToken}`,
                        },
                    }));
                    // Retry the original operation
                    const subscriber = {
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    };
                    forward(operation)?.subscribe(subscriber);
                })
                .catch(err => {
                    // On refresh failure: clear session and redirect
                    localStorage.removeItem('jwtToken');
                    window.location.href = '/login';
                    observer.error(err);
                });
        });
    }
    // For other errors, do nothing (pass through)
});

// 4) Compose links
const link = from([errorLink, authLink, httpLink]);

// 5) Instantiate client
export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache({
        // possibleTypes, etc.
    }),
});
