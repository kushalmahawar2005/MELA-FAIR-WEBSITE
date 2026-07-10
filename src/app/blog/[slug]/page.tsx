import { Metadata } from "next";
import { getPostBySlug, blogPosts } from "@/lib/blog";
import BlogDetailClient from "./blog-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title} | Chronicles`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Naaz Amusement`,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
