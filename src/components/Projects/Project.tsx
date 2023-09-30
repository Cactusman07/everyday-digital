import React from 'react';

interface Project {
	title: string;
	image: string;
	excerpt: string;
	content: string;
}

const Project = (props: Project) => {
	const backgroundImage = `url(${props.image})`;

	return (
		<div className='inline-block px-3'>
			<div className='w-80 h-56 max-w-xs overflow-hidden'>
				<div className='max-w-sm w-full lg:max-w-full lg:flex'>
					<div
						className='h-56 lg:h-auto lg:w-28 flex-none bg-cover bg-no-repeat rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden'
						style={{ backgroundImage }}
						title={props.title}></div>
					<div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
						<div className='mb-8'>
							<div className='text-gray-900 font-bold text-xl mb-2'>
								Can coffee make you a better developer?
							</div>
							<p className='text-gray-700 text-base'>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								Voluptatibus quia, nulla! Maiores et perferendis eaque,
								exercitationem praesentium nihil.
							</p>
						</div>
						<div className='flex items-center'>
							<span>Read more...</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Project;
