"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Link2, Sparkles } from "lucide-react";
import { getPostBySlug, blogPosts, BlogPost } from "@/lib/blog";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
        <Header />
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-32 text-center">
          <h1 className="font-display text-4xl text-accent-yellow">Article Not Found</h1>
          <p className="mt-4 text-xs text-white/50">The blog post you are looking for does not exist.</p>
          <Link
            href="/blog"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent-yellow px-8 text-xs font-display tracking-widest text-deep-purple"
          >
            BACK TO BLOG
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Related posts (excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-600/10 blur-[150px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/blog"
            className="group relative mb-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <div className="mb-10">
            <span className="inline-block rounded-md bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow px-3 py-1 text-[10px] font-display uppercase tracking-widest font-semibold mb-4">
              {post.category}
            </span>
            
            <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-none tracking-wide text-white">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
              <div className="flex items-center gap-4 text-xs text-white/60 font-mono-ibm">
                <span>{post.meta.split(" · ")[0] || "Naaz Amusement"}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.meta.split(" · ")[1] || post.meta}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareLink}
                  aria-label="Copy post link"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <Link2 className="h-4 w-4" />
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Main image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/9] w-full rounded-[2rem] border border-white/10 bg-white/[0.01] p-3 sm:p-4 shadow-2xl overflow-hidden mb-12"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Article Blocks */}
          <article className="prose prose-invert max-w-none text-white/70 leading-relaxed text-base sm:text-lg space-y-8 font-geist border-b border-white/10 pb-16">
            {post.blocks.map((block, idx) => {
              if (block.type === "paragraph") {
                return (
                  <p key={idx} className="text-white/80 whitespace-pre-line">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "subheading") {
                return (
                  <h2 key={idx} className="font-display text-2xl sm:text-3xl text-white tracking-wide mt-8 mb-4">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <div key={idx} className="relative my-8 border-l-4 border-accent-yellow bg-white/5 p-6 rounded-r-xl">
                    <p className="italic text-white text-base sm:text-lg">
                      "{block.text}"
                    </p>
                    {block.author && (
                      <span className="block mt-2 text-xs font-mono-ibm text-accent-yellow uppercase tracking-widest">
                        — {block.author}
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow flex items-center gap-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-accent-yellow" />
                RECOMMENDED READS
              </span>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.slug}
                    href={`/blog/${rPost.slug}`}
                    className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/10 transition"
                  >
                    <span className="text-[10px] text-accent-yellow font-display uppercase tracking-widest">
                      {rPost.category}
                    </span>
                    <h3 className="mt-2 font-display text-lg leading-snug text-white group-hover:text-accent-yellow transition line-clamp-2">
                      {rPost.title}
                    </h3>
                    <p className="mt-2 text-xs text-white/40 line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
