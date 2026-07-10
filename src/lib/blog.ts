export type BlogParagraph = {
  type: "paragraph";
  text: string;
};

export type BlogSubheading = {
  type: "subheading";
  text: string;
};

export type BlogQuote = {
  type: "quote";
  text: string;
  author?: string;
};

export type BlogBlock = BlogParagraph | BlogSubheading | BlogQuote;

export type BlogPost = {
  slug: string;
  title: string;
  meta: string;
  image: string;
  excerpt: string;
  readTime: string;
  category: string;
  blocks: BlogBlock[];
};



export const blogPosts: BlogPost[] = [];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
