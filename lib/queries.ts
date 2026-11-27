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
    projects(first: 100) {
      nodes {
        databaseId
        content
        date
        modified
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
    services(first: 100) {
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
    posts(first: 100) {
      nodes {
        databaseId
        content(format: RENDERED)
        date
        modified
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
    teams(first: 100) {
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
    testimonials(first: 100) {
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
    projects(first: 100) {
      nodes {
        databaseId
        content
        date
        modified
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
    services(first: 100) {
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
    testimonials(first: 100) {
      nodes {
        content(format: RENDERED)
        title
      }
    }
    teams(first: 100) {
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
    posts(first: 100) {
      nodes {
        databaseId
        content(format: RENDERED)
        date
        modified
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
