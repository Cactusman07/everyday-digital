export const PAGES_QUERY = `
  query Pages {
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
  }
`;

export const PROJECTS_QUERY = `
  query Projects {
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
  }
`;

export const SERVICES_QUERY = `
  query Services {
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
  }
`;

export const POSTS_QUERY = `
  query Posts {
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

export const TEAMS_QUERY = `
  query Teams {
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
  }
`;

export const TESTIMONIALS_QUERY = `
  query Testimonials {
    testimonials {
      nodes {
        content(format: RENDERED)
        title
      }
    }
  }
`;

export const ALL_CONTENT_QUERY = `
  query AllContent {
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
