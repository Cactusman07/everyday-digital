import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  LandingSplashScreen,
  NotFound,
  Fade,
  HomeScreen,
  PageContent,
  SingleItemPage,
} from "./components/ContentIndex";

import { useQuery } from "@apollo/client";
import { GET_ALL_CONTENT } from "./hooks/graphquery";
import { WPPage, ContentData } from "./types";

const App = () => {
  const { loading, error, data } = useQuery<ContentData>(GET_ALL_CONTENT, {
    errorPolicy: "all",
  });
  const visibleErrors = error?.graphQLErrors.filter(
    (e) => !e.message.includes('"seo"'),
  );

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Fade show={loading} fadeIn={false} fadeOut={true}>
        <LandingSplashScreen />
      </Fade>
      {!!visibleErrors?.length && <h1>Error: {visibleErrors[0].message}</h1>}
      <React.Fragment>
        <HomeScreen
          menu={
            !!data && !!data.pages
              ? data.pages.nodes.filter((p: WPPage) => !p.isFrontPage)
              : null
          }
        />
        {!loading && !!data && (
          <Routes>
            {data.pages.nodes
              .filter((page: WPPage) => !page.isFrontPage)
              .map((page: WPPage) => {
                return (
                  <Route
                    key={page.databaseId}
                    path={page.uri}
                    element={
                      <PageContent
                        content={page.content}
                        featuredImage={page.featuredImage}
                        title={page.title}
                        projects={data.projects.nodes}
                        team={data.teams.nodes}
                        services={data.services.nodes}
                        posts={data.posts.nodes}
                        testimonials={data.testimonials.nodes}
                      />
                    }
                  ></Route>
                );
              })}
            <Route
              path="/blog/:slug"
              element={
                <SingleItemPage
                  type="blog"
                  posts={data.posts.nodes}
                  projects={data.projects.nodes}
                  services={data.services.nodes}
                  testimonials={data.testimonials.nodes}
                />
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <SingleItemPage
                  type="project"
                  posts={data.posts.nodes}
                  projects={data.projects.nodes}
                  services={data.services.nodes}
                  testimonials={data.testimonials.nodes}
                />
              }
            />
            <Route
              path="/services/:slug"
              element={
                <SingleItemPage
                  type="service"
                  posts={data.posts.nodes}
                  projects={data.projects.nodes}
                  services={data.services.nodes}
                  testimonials={data.testimonials.nodes}
                />
              }
            />
            <Route
              path="/:slug"
              element={
                <SingleItemPage
                  type="blog"
                  posts={data.posts.nodes}
                  projects={data.projects.nodes}
                  services={data.services.nodes}
                  testimonials={data.testimonials.nodes}
                />
              }
            />
            <Route path="/" element={<></>}></Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </React.Fragment>
    </Router>
  );
};

export default App;
