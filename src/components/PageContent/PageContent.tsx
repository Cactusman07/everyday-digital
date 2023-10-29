import React from 'react';

import { Footer, ProjectContainer, RenderTableContent } from '../ContentIndex';
import { titleCSS, pageContent } from 'content';

interface PageContent {
	content: any;
	title: string;
	featuredImage: object;
	seo: {
		title: string;
		metaDesc: string;
		metaKeywords: string;
	};
	projects: {
		date: string;
		excerpt: string;
		featuredImage: object;
		content: string;
		title: string;
	};
}

const PageContent = (props: PageContent) => {
	const pageTitle = `${props.seo.title} | Your Digital Partner`;
	document.title = pageTitle;
	document.querySelector('title').innerText = pageTitle;
	document
		.querySelector('meta[name="description"]')
		.setAttribute('content', props.seo.metaDesc);

	let contentToRender = '',
		tableContent = '';
	if (!!props?.content) {
		[contentToRender, tableContent] = props.content.split(
			`<div class="wp-block-group is-layout-constrained"><div class="wp-block-group__inner-container">`
		);
	}

	return (
		<>
			{!!props.content && (
				<React.Fragment>
					<div id='content' className='mt-48 mb-24 mx-8 relative z-0'>
						<h2>{props.title}</h2>
						<div dangerouslySetInnerHTML={{ __html: contentToRender }} />
						{props.title === 'Projects' && (
							<ProjectContainer data={props.projects} />
						)}
						{!!tableContent?.length && (
							<RenderTableContent tableContent={tableContent} />
						)}
						<Footer />
					</div>

					<style>
						{titleCSS}
						{pageContent}
					</style>
				</React.Fragment>
			)}
		</>
	);
};

export default PageContent;
