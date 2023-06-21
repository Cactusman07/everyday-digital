import React from 'react';

interface Project {
  title: string;
  key: number;
}

const Project = (props: Project) => {

  return (
    <React.Fragment>
      <div className="m-3 min-w-full p-4 md:w-1/3 flex rounded	border-1 border-slate-50 border-solid	shadow group hover:bg-black " >
        <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-red-100 text-red-500 mb-4 flex-shrink-0">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div className="flex-grow pl-6">
          <h2 className="text-gray-900 text-lg title-font font-medium mb-2 group-hover:text-white">{props.title}</h2>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Project;