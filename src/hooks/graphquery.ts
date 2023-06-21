import { gql } from "@apollo/client";

export const GET_ALL_PROJECTS = gql`
  query NewQuery {
    projects {
      nodes {
        title
      }
    }
  }
`;