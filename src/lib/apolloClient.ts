import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';

const httpLink = createHttpLink({ uri: '/api/graphql' });

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        operation.setContext(({ headers = {} }) => ({
            headers: { ...headers, Authorization: `Bearer ${token}` },
        }));
    }
    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
