import { gql } from "@apollo/client";

export const GET_ALL_CONTENT = gql`
  query ALL_CONTENT {
    pages(where: { status: PUBLISH }) {
      nodes {
        content(format: RENDERED)
        databaseId
        featuredImage {
          node {
            altText
            title
            sourceUrl
            slug
            uri
          }
        }
        title
        uri
        isPostsPage
        isFrontPage
      }
    }
    projects {
      nodes {
        databaseId
        content
        date
        excerpt
        featuredImage {
          node {
            altText
            sourceUrl
            title
          }
        }
        title
        slug
      }
    }
    services {
      nodes {
        databaseId
        featuredImage {
          node {
            altText
            title
            uri
            slug
            sourceUrl
          }
        }
        excerpt
        content(format: RENDERED)
        title
        slug
      }
    }
    testimonials {
      nodes {
        content(format: RENDERED)
        title
      }
    }
    teams {
      nodes {
        databaseId
        featuredImage {
          node {
            altText
            sourceUrl
            title
            uri
            slug
          }
        }
        excerpt
        content(format: RENDERED)
        title
      }
    }
    posts {
      nodes {
        databaseId
        content(format: RENDERED)
        date
        excerpt
        featuredImage {
          node {
            altText
            slug
            sourceUrl
            title
            uri
          }
        }
        title
        slug
        tags {
          nodes {
            name
          }
        }
      }
    }
  }
`;
