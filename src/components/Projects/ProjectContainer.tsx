import React from 'react';

import { Fade, Project } from '../ContentIndex';
import { titleCSS, hideScroll } from 'content';

const ProjectContainer = ({ data }: { data: any }) => {
	const projectFound = Boolean(data);

	return (
		<>
			<div id='projects' className='fixed inset-x-8	top-40 md:top-36 lg:top-28'>
				<Fade show={true} fadeIn={true} fadeOut={false}>
					<h1 className='text-center md:block text-8xl lg:text-[160px] xl:text-[210px] my-auto'>
						Projects
					</h1>

					{!projectFound ? (
						<p>Projects could not be found</p>
					) : (
						<div className='flex flex-col m-auto p-auto'>
							<div className='flex overflow-x-scroll pb-10 hide-scroll-bar'>
								<div className='flex flex-nowrap lg:ml-40 md:ml-20 ml-10 '></div>
							</div>
							{data.nodes?.map((project: any, index: number) => (
								<Project
									title={project.title}
									image={project.featuredImage.node.sourceUrl}
									excerpt={project.excerpt}
									content={project.content}
									key={index}
								/>
							))}
						</div>
					)}
				</Fade>
			</div>

			<style>
				{titleCSS}
				{hideScroll}
			</style>
		</>
	);
};

export default ProjectContainer;
