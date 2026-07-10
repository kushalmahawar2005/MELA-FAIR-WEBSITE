"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { blogPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

const categories = ["All", "Community", "Celebrations", "Rides Guide"];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  const handleCategoryChange = (cat: string) => {
    startTransition(() => {
      setSelectedCategory(cat);
    });
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] h-[40%] w-[35%] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[30%] left-[-5%] h-[50%] w-[35%] rounded-full bg-emerald-600/10 blur-[130px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="max-w-3xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent-yellow animate-pulse" />
              NAAZ AMUSEMENT CHRONICLES
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-wide text-white">
              Stories, News & <br />
              <span className="text-accent-yellow">Behind-The-Scenes</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Stay up to date with the latest announcements, safety updates, and special events happening across Naaz Amusement's carnivals in Rajasthan, Delhi & Uttar Pradesh.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8">
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-display tracking-wider uppercase transition active:scale-95 cursor-pointer",
                    selectedCategory === cat
                      ? "bg-accent-yellow text-deep-purple font-semibold shadow-[0_0_12px_rgba(238,167,39,0.3)]"
                      : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-6 text-xs text-white placeholder-white/30 outline-none focus:border-accent-yellow focus:bg-white/10 transition"
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="mt-12">
            {filteredPosts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, i) => (
                    <motion.article
                      key={post.slug}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1"
                    >
                      <Link href={`/blog/${post.slug}`} className="block h-full">
                        {/* Image */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-block rounded-md bg-accent-yellow text-deep-purple px-3 py-1 text-[9px] font-display uppercase tracking-widest font-semibold">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col h-[220px] justify-between">
                          <div>
                            <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono-ibm mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {post.meta.split(" · ")[1] || post.meta}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime}
                              </span>
                            </div>

                            <h3 className="font-display text-xl tracking-wide text-white group-hover:text-accent-yellow transition line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="mt-2 text-xs text-white/50 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent-yellow group-hover:underline">
                            Read Article
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/40">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-white">Coming Soon</h3>
                <p className="mt-2 text-sm text-white/50 max-w-sm">
                  We are currently writing fresh, authentic stories and updates. Please check back later!
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
