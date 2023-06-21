import { useQuery } from '@apollo/client/react';
import React from 'react';
import { GET_ALL_PROJECTS } from '../../hooks/graphquery';
import Project from './Project'

const ProjectContainer = () => {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);
  const projectFound = Boolean(data?.projects);

  return (
    <React.Fragment>
      <div id="frontPagePosts" className="container px-5 py-24 mx-auto">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">Projects</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : !projectFound ? (
          <p>Projects cound not be found</p>
        ) : (
          <div className="flex flex-wrap">
          
            {data.projects.nodes?.map((project: any, index: number) => (

              <Project title={project.title} key={index} />
              
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ProjectContainer;