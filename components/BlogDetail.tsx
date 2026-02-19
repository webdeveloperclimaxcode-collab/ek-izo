"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import Spinner from "./Spinner";

interface BlogCategory {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  featuredImage: string | null;
  images: string[];
  category: BlogCategory | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogDetail({ blogId }: { blogId: string }) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${blogId}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Blog not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1200px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`flex items-center cursor-pointer gap-2 mb-6 transition-colors group ${theme === "dark"
            ? "text-gray-300 hover:text-[#9F001B]"
            : "text-[#1B2556] hover:text-[#9F001B]"
            }`}
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-[16px] font-semibold">Back to Blogs</span>
        </button>

        {/* Blog Header */}
        <div className="mb-8">
          {/* Category */}
          {blog.category && (
            <span className="inline-block px-4 py-1.5 bg-[#9F001B] text-white text-[12px] font-semibold uppercase tracking-wider rounded-full mb-4">
              {blog.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className={`text-[42px] font-bold mb-4 leading-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className={`flex flex-wrap items-center gap-4 text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>By {blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/services/date.svg"
                alt="Date"
                width={18}
                height={18}
                className="w-5 h-5"
              />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="relative w-full h-[500px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div
            className={`text-[16px] leading-relaxed whitespace-pre-line transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Additional Images */}
        {blog.images && blog.images.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-[24px] font-bold mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.images.map((image, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-[18px] font-bold mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 text-[14px] rounded-full transition-colors ${theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-[#4A5568] hover:bg-gray-200"
                    }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className={`border-t pt-8 transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-[18px] font-bold mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>Share this article</h3>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-[#1B2556] text-white rounded-full hover:opacity-90 transition-opacity text-[14px] font-semibold">
              Share on Facebook
            </button>
            <button className="px-6 py-3 bg-[#9F001B] text-white rounded-full hover:opacity-90 transition-opacity text-[14px] font-semibold">
              Share on Twitter
            </button>
            <button className={`px-6 py-3 text-white rounded-full hover:opacity-90 transition-opacity text-[14px] font-semibold ${theme === "dark"
              ? "bg-gray-700"
              : "bg-gray-700"
              }`}>
              Share on LinkedIn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
