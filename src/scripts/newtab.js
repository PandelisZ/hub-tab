import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-client';

import { ApolloProvider } from '@apollo/react-hooks';

import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import Repos from './components/repos';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await browser.storage.local.get('accessToken');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token.accessToken ? `Bearer ${token.accessToken}` : '',
        },
    };
});

const cache = new InMemoryCache();

persistCache({
    cache,
    storage: window.localStorage,
}).then(() => {
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
    });

    const App = () => {
        return (
            <ApolloProvider client={client}>
                <Repos />
            </ApolloProvider>
        );
    };

    ReactDOM.render(<App />, document.getElementById('root'));
});
