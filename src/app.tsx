import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
	ProjectContainer,
	LandingSplashScreen,
	NotFound,
	Fade,
	HomeScreen,
} from './components/ContentIndex';

import { useQuery } from '@apollo/client';
import { GET_ALL_CONTENT } from './hooks/graphquery';

const App = () => {
	const { loading, error, data } = useQuery(GET_ALL_CONTENT);

	return (
		<Router>
			<Fade show={loading} fadeIn={false} fadeOut={true}>
				<LandingSplashScreen />
			</Fade>
			{error ? (
				<h1>Error: {error.message}</h1>
			) : (
				<React.Fragment>
					<HomeScreen />
					<Routes>
						<Route path='/' element={<></>}></Route>
						<Route
							path='/projects'
							element={<ProjectContainer data={data.projects} />}></Route>
						{/* 					<Route
							path='/about'
							element={<ProjectContainer data={data} />}></Route>
						<Route
							path='/services'
							element={<ProjectContainer data={data} />}></Route>
						<Route
							path='/pricing'
							element={<ProjectContainer data={data} />}></Route>
						<Route
							path='/contact'
							element={<ProjectContainer data={data} />}></Route> */}

						<Route path='*' element={<NotFound />} />
					</Routes>
				</React.Fragment>
			)}
		</Router>
	);
};

export default App;
