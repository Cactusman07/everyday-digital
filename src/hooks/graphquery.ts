import { gql } from '@apollo/client';

export const GET_ALL_CONTENT = gql`
	query ALL_CONTENT {
		pages {
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
				seo {
					metaDesc
					metaKeywords
					title
				}
			}
		}
		projects {
			nodes {
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
			}
		}
	}
`;
