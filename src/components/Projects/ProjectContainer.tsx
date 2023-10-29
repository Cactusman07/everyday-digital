import React from 'react';

import { Project } from '../ContentIndex';

const ProjectContainer = ({ data }: { data: any }) => {
	const projectFound = data.length > 0 ? true : false;

	return (
		<div id='projects' className='mt-8'>
			{!projectFound ? (
				<p>Your project could be here... Get in touch!</p>
			) : (
				<div className='projectWrapper flex'>
					{data.map((project: any, index: number) => (
						<Project
							title={project.title}
							image={
								!!project.featuredImage ? project.featuredImage.node : null
							}
							excerpt={project.excerpt}
							content={project.content}
							key={index}
							index={index}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ProjectContainer;
