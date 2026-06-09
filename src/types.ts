export interface WPImageNode {
	sourceUrl: string;
	altText?: string;
	title?: string;
	slug?: string;
	uri?: string;
}

export interface WPFeaturedImage {
	node: WPImageNode;
}

export interface WPPage {
	content: string | null;
	databaseId: number;
	featuredImage?: WPFeaturedImage;
	title: string;
	uri: string;
	isPostsPage: boolean;
	isFrontPage: boolean;
}

export interface WPProject {
	content: string;
	date?: string;
	excerpt?: string;
	featuredImage?: WPFeaturedImage;
	title: string;
	slug: string;
}

export interface WPService {
	featuredImage?: WPFeaturedImage;
	excerpt: string;
	content: string;
	title: string;
}

export interface WPTeam {
	featuredImage?: WPFeaturedImage;
	excerpt: string;
	content: string;
	title: string;
}

export interface WPPost {
	content: string;
	date: string;
	excerpt?: string;
	featuredImage?: WPFeaturedImage;
	title: string;
}

export interface WPTestimonial {
	content: string;
	title: string;
}

export interface ContentData {
	pages: { nodes: WPPage[] };
	projects: { nodes: WPProject[] };
	services: { nodes: WPService[] };
	testimonials: { nodes: WPTestimonial[] };
	teams: { nodes: WPTeam[] };
	posts: { nodes: WPPost[] };
}
