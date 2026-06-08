import React from 'react';
import { Link } from 'react-router-dom';

import {
	Footer,
	ProjectContainer,
	AboutUsProfiles,
	AboutSection,
	GeneralContentRenderer,
	Testimonials,
	ContactForm,
} from '../ContentIndex';
import { useContentContext } from 'index';
import { titleCSS, pageContent } from 'content';

interface PageContent {
	toggle: () => {};
	updateContentData: (data: any) => {};
	content: any;
	title: string;
	featuredImage: object;
	seo?: {
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
	const pageTitle = `${props.seo?.title ?? props.title} | Your Digital Partner`;
	document.title = pageTitle;
	if (props.seo?.metaDesc) {
		document.querySelector('meta[name="description"]')?.setAttribute('content', props.seo.metaDesc);
	}

	const { toggleShowContent, updateContentData } = useContentContext();

	return (
		<>
			<div id='content' className='mt-48 mb-24 mx-8 relative z-0'>
				<h2>{props.title}</h2>
				{!!props.content && !props.title?.toLowerCase().includes('contact') && (
					<div dangerouslySetInnerHTML={{ __html: props.content }} />
				)}
				{props.title?.toLowerCase().includes('contact') && (
					<>
						<div className='border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5 mb-2'>
							<p className='text-[#4bafeb] text-[32px] font-bold mt-0 mb-3'>Let's Talk</p>
							<p className='text-white/70 text-base leading-relaxed m-0'>
								Whether you've got a clear brief or just an idea — we're here to help. Fill in the form and we'll get back to you within one business day.
							</p>
							<p className='text-white/40 text-sm mt-3 mb-0'>
								Prefer to reach us another way?{' '}
								<a href='tel:0211759457' className='projects-cta-link'>021 175 9457</a>
								{' '}or{' '}
								<a href='mailto:hello@everydaydigital.co.nz' className='projects-cta-link'>hello@everydaydigital.co.nz</a>
							</p>
						</div>
						<ContactForm />
					</>
				)}
				{props.title === 'Projects' && (
					<ProjectContainer data={props.projects} />
				)}
				{props.title?.toLowerCase().includes('about') && (
					<>
						<AboutSection />
						<AboutUsProfiles
							data={props.team}
							toggle={toggleShowContent}
							updateContentData={updateContentData}
						/>
					</>
				)}
				{props.title === 'Blog' && (
					<>
						<div className='border-l-4 border-[#4b6ceb] rounded-r-xl bg-white/5 px-6 py-5 mb-2'>
							<p className='text-[#4bafeb] text-[32px] font-bold mt-0 mb-3'>Digital Thinking, Every Day</p>
							<p className='text-white/70 text-base leading-relaxed m-0'>
								Practical tips, honest opinions, and ideas from the team at Every Day Digital — covering websites, automation, digital strategy, and what's actually working for small and growing businesses in New Zealand.
							</p>
							<p className='text-white/40 text-sm mt-3 mb-0'>
								Have a topic you'd like us to cover?{' '}
								<Link to='/contact/' className='projects-cta-link'>Get in touch →</Link>
							</p>
						</div>
						<GeneralContentRenderer
							data={props.posts}
							icons={false}
							toggle={toggleShowContent}
							updateContentData={updateContentData}
						/>
						<div className='mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap'>
							<p className='text-white/70 text-base leading-relaxed m-0'>
								<strong className='text-white font-medium'>Ready to put these ideas into practice?</strong><br />
								We work with businesses across New Zealand to make digital less complicated and more effective.
							</p>
							<Link to='/contact/'>
								<button className='bg-[#4b6ceb] hover:bg-[#4bafeb] transition-colors duration-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer'>
									Get in touch
								</button>
							</Link>
						</div>
					</>
				)}
				{props.title === 'Services' && (
					<>
						<GeneralContentRenderer
							data={props.services}
							icons={true}
							toggle={toggleShowContent}
							updateContentData={updateContentData}
						/>
						<div className='mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap'>
							<p className='text-white/70 text-base leading-relaxed m-0'>
								<strong className='text-white font-medium'>Ready to get started?</strong><br />
								Whether you know exactly what you need or you're still figuring it out — we're easy to talk to and happy to help with no pressure.
							</p>
							<Link to='/contact/'>
								<button className='bg-[#4b6ceb] hover:bg-[#4bafeb] transition-colors duration-300 text-white rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer'>
									Contact us
								</button>
							</Link>
						</div>
					</>
				)}
				<Testimonials data={props.testimonials} />
				<Footer />
			</div>

			<style>
				{titleCSS}
				{pageContent}
			</style>
		</>
	);
};

export default PageContent;
