import { ApolloClient, InMemoryCache } from '@apollo/client';
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache()

persistCacheSync({
  cache,
  storage: new LocalStorageWrapper(window.localStorage)
});

const client = new ApolloClient({
  uri: '/graphql',
  cache: cache,
});

export default client;