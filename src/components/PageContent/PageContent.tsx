import React from 'react';

import {
	Footer,
	ProjectContainer,
	RenderTableContent,
	AboutUsProfiles,
	GeneralContentRenderer,
	Testimonials,
} from '../ContentIndex';
import { useContentContext } from 'index';
import { titleCSS, pageContent } from 'content';

interface PageContent {
	toggle: () => {};
	updateContentData: (data: any) => {};
	content: any;
	title: string;
	featuredImage: object;
	seo: {
		title: string;
		metaDesc: string;
		metaKeywords: string;
	};
	projects: {
		excerpt: string;
		featuredImage: object;
		content: string;
		title: string;
	};
	team: {
		excerpt: string;
		featuredImage: object;
		content: string;
		title: string;
	};
	services: {
		excerpt: string;
		featuredImage: object;
		content: string;
		title: string;
	};
	posts: {
		date: string;
		excerpt: string;
		featuredImage: object;
		content: string;
		title: string;
	};
	testimonials: {
		date: string;
		excerpt: string;
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

	const { toggleShowContent, updateContentData } = useContentContext();

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
							<ProjectContainer
								data={props.projects}
								toggle={toggleShowContent}
								updateContentData={updateContentData}
							/>
						)}
						{!!tableContent?.length && props.title === 'Pricing' && (
							<RenderTableContent tableContent={tableContent} />
						)}
						{props.title === 'About Every Day Digital' && (
							<AboutUsProfiles
								data={props.team}
								toggle={toggleShowContent}
								updateContentData={updateContentData}
							/>
						)}
						{props.title === 'Blog' && (
							<GeneralContentRenderer
								data={props.posts}
								icons={false}
								toggle={toggleShowContent}
								updateContentData={updateContentData}
							/>
						)}
						{props.title === 'Services' && (
							<GeneralContentRenderer
								data={props.services}
								icons={true}
								toggle={toggleShowContent}
								updateContentData={updateContentData}
							/>
						)}
						<Testimonials data={props.testimonials} />
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
