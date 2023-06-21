import React from 'react';
import ProjectContainer from './components/Projects/ProjectContainer';
import client from './apollo';
import { ApolloProvider } from '@apollo/client';

const App = () => {
  return (
    //@ts-ignore
    <ApolloProvider client={client}>
      <ProjectContainer />
    </ApolloProvider>
  );
}

export default App;