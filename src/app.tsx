import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import ProjectContainer from './components/Projects/ProjectContainer';
import LandingSplashScreen from 'components/LoadingSplashScreen/LandingSplashScreen';
import NotFound from 'components/404/404';
import Fade from 'components/Fader/Fade';
import HomeScreen from 'components/HomeScreen/HomeScreen';

import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from './hooks/graphquery';

const App = () => {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);

  return (
    <Router>
        <Fade show={loading} fadeIn={false} fadeOut={true}>
          <LandingSplashScreen />
        </Fade>
        { error ? (
          <h1>Error: {error.message}</h1>
        ) : (
          <React.Fragment>
            <HomeScreen />
            <Routes>
              <Route path='/' element={<React.Fragment />}></Route>
              <Route path='/projects' element={<ProjectContainer data={data} />}></Route>

              <Route path='*' element={<NotFound />}/>
            </Routes>
          </React.Fragment>
      )} 
    </Router>
  );
}

export default App;