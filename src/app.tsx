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
import { WPPage, ContentData } from './types';

const App = () => {
	const { loading, error, data } = useQuery<ContentData>(GET_ALL_CONTENT, { errorPolicy: 'all' });
	const visibleErrors = error?.graphQLErrors.filter(e => !e.message.includes('"seo"'));
	const { toggleShowContent, updateContentData } = useContentContext();

	return (
		<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<Fade show={loading} fadeIn={false} fadeOut={true}>
				<LandingSplashScreen />
			</Fade>
			{!!visibleErrors?.length && <h1>Error: {visibleErrors[0].message}</h1>}
			<React.Fragment>
				<HomeScreen menu={!!data && !!data.pages ? data.pages.nodes.filter((p: WPPage) => !p.isFrontPage) : null} />
				{!loading && !!data && (
					<Routes>
						{data.pages.nodes.filter((page: WPPage) => !page.isFrontPage).map((page: WPPage, index: number) => {
							return (
								<Route
									key={index}
									path={page.uri}
									element={
										<PageContent
											toggle={toggleShowContent}
											updateContentData={updateContentData}
											content={page.content}
											featuredImage={page.featuredImage}
											title={page.title}
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
