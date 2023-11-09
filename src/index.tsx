import React, { createContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app';
import client from './apollo';
import { ApolloProvider } from '@apollo/client';

const root = createRoot(document.getElementById('root') as HTMLElement);

const ContentContext = createContext({} as any);

const ContentProvider = ({ children }: any) => {
	const [showContent, setShowContent] = useState(false);
	const [contentData, setContentData] = useState({
		title: '',
		content: '',
		image: '',
		date: '',
		isIcon: false,
		isProfile: false,
	});

	const toggleShowContent = () => {
		setShowContent((prev) => !prev);
	};

	const updateContentData = (data: any) => {
		setContentData((prevData) => ({ ...prevData, ...data }));
	};

	return (
		<ContentContext.Provider
			value={{
				showContent,
				toggleShowContent,
				contentData,
				updateContentData,
			}}>
			{children}
		</ContentContext.Provider>
	);
};

export const useContentContext = () => React.useContext(ContentContext);

root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<ContentProvider>
				<App />
			</ContentProvider>
		</ApolloProvider>
	</React.StrictMode>
);

/* StrictMode is a tool for highlighting potential problems in an application 
   We’re just using it here to help debug issues. StrictMode checks are run in 
   development mode only and don’t impact production builds
*/
