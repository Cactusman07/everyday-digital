import React from 'react';

import Project from './Project';
import { titleCSS } from 'content';

const ProjectContainer = ({ data }: { data: any }) => {
  const projectFound = Boolean(data?.projects);

  return (
    <React.Fragment>
      <div id="projects" className="fixed">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-white-900 mb-20">Projects</h1>
        
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
      <style>
        {titleCSS}
      </style>
    </React.Fragment>
  );
};

export default ProjectContainer;