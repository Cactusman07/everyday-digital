import React from 'react';
import Project from './Project';

const ProjectContainer = ({ data }: { data: any }) => {
  const projectFound = Boolean(data?.projects);

  return (
    <div id="frontPagePosts" className="container px-5 py-24 mx-auto">
      <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">Projects</h1>
      
      {!projectFound ? (
        <p>Projects could not be found</p>
      ) : (
        <div className="flex flex-wrap">
          {data.projects.nodes?.map((project: any, index: number) => (
            <Project title={project.title} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectContainer;