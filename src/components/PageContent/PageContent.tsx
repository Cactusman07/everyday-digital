import React from 'react';

interface PageContent {
	content: any;
	title: string;
	featuredImage: object;
}

const PageContent = (props: PageContent) => {
	return (
		<>
			{!!props.content && (
				<div
					id='pageContent'
					className='absolute bottom-[150px] inset-x-[10%] min-h-[200px] ml-8 mr-8'>
					<h3>{props.title}</h3>
					<div>{props.content}</div>
				</div>
			)}
		</>
	);
};

export default PageContent;
