import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from './hooks/graphquery';

import ProjectContainer from './components/Projects/ProjectContainer';
import LandingSplashScreen from 'components/LoadingSplashScreen/LandingSplashScreen';
import Fade from 'components/Fader/Fade';
import HomeScreen from 'components/HomeScreen/HomeScreen';

const App = () => {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);

  return (
    <React.Fragment>        
        <Fade show={loading} fadeIn={false} fadeOut={true}>
          <LandingSplashScreen />
        </Fade>
        { error ? (
        <p>Error: {error.message}</p>
      ) : (
        <React.Fragment>
          <HomeScreen />
          <ProjectContainer data={data} />
        </React.Fragment>
      )} 
    </React.Fragment>
  );
}

export default App;