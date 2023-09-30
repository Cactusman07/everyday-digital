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
	}
`;
