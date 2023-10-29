import React from 'react';

interface Project {
	title: string;
	image: {
		altText: string;
		sourceUrl: string;
	} | null;
	excerpt: string;
	content: string;
	index: number;
}

const Project = (props: Project) => {
	const showImage = !!props.image;
	return (
		<div className='project max-w-xs rounded-md overflow-hidden shadow-lg bg-slate-50 m-3'>
			{showImage && (
				<div
					style={{
						backgroundImage: `url(${props.image.sourceUrl}`,
						height: '150px',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
			)}
			<div className='px-6 py-2'>
				<h4 className='mb-2 text-black'>{props.title}</h4>
				<p
					className='text-gray-700 text-base'
					dangerouslySetInnerHTML={{ __html: props.excerpt }}></p>
			</div>
		</div>
	);
};

export default Project;
