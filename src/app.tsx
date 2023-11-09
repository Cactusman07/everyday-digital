import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
	LandingSplashScreen,
	NotFound,
	Fade,
	HomeScreen,
	PageContent,
} from './components/ContentIndex';

import { useQuery } from '@apollo/client';
import { GET_ALL_CONTENT } from './hooks/graphquery';
import { useContentContext } from 'index';

const App = () => {
	const { loading, error, data } = useQuery(GET_ALL_CONTENT);
	const { toggleShowContent, updateContentData } = useContentContext();

	return (
		<Router>
			<Fade show={loading} fadeIn={false} fadeOut={true}>
				<LandingSplashScreen />
			</Fade>
			{error && <h1>Error: {error.message}</h1>}
			<React.Fragment>
				<HomeScreen menu={!!data && !!data.pages ? data.pages.nodes : null} />
				{!loading && !!data && (
					<Routes>
						{data.pages.nodes.map((page: any, index: number) => {
							return (
								<Route
									key={index}
									path={`/${page.uri}`}
									element={
										<PageContent
											toggle={toggleShowContent}
											updateContentData={updateContentData}
											content={page.content}
											featuredImage={page.featuredImage}
											title={page.title}
											seo={page.seo}
											projects={data.projects.nodes}
											team={data.teams.nodes}
											services={data.services.nodes}
											posts={data.posts.nodes}
											testimonials={data.testimonials.nodes}
										/>
									}></Route>
							);
						})}
						<Route path='/' element={<></>}></Route>
						<Route path='*' element={<NotFound />} />
					</Routes>
				)}
			</React.Fragment>
		</Router>
	);
};

export default App;
