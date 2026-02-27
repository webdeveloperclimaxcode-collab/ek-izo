"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  category: BlogCategory | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
}

interface BlogListingProps {
  searchQuery: string;
  selectedCategory: string;
  selectedYear: string;
}

export default function BlogListing({ searchQuery, selectedCategory, selectedYear }: BlogListingProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, selectedCategory, selectedYear]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (selectedYear) params.append("year", selectedYear);

      const response = await fetch(`/api/blog?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Description */}
        <p className={`text-[15px] text-center mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
          Press releases, press kits and other content for journalists
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col ${theme === "dark"
                      ? "bg-[#000000] border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48">
                      {blog.featuredImage ? (
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${theme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                          }`}>
                          <span className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Category */}
                      {blog.category && (
                        <span className={`text-[11px] uppercase tracking-wider mb-3 block transition-colors duration-300 ${theme === "dark"
                          ? "text-white"
                          : "text-[#a8a8a8]"
                          }`}>
                          {blog.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className={`text-[16px] font-semibold mb-3 leading-tight line-clamp-2 flex-1 transition-colors duration-300 ${theme === "dark"
                        ? "text-white"
                        : "text-brand-primary"
                        }`}>
                        {blog.title}
                      </h3>

                      {/* Author */}
                      <p className={`text-[13px] mb-3 transition-colors duration-300 ${theme === "dark"
                        ? "text-white"
                        : "text-[#6B7280]"
                        }`}>
                        By {blog.author}
                      </p>

                      {/* Date with Icon */}

                      {/* white date icon  */}
                      {/* /assets/images/services/date_white.svg */}
                      <div className="flex items-center gap-2 mt-auto">
                        <Image
                          src={theme === "dark" ? "/assets/images/services/date_white.svg" : "/assets/images/services/date.svg"}
                          alt="Date"
                          width={18}
                          height={18}
                          className="w-[18px] h-[18px]"
                        />
                        <span className={`text-[13px] font-medium transition-colors duration-300 ${theme === "dark"
                          ? "text-white"
                          : "text-brand-primary"
                          }`}>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className={`text-lg transition-colors duration-300 ${theme === "dark"
                    ? "text-gray-500"
                    : "text-gray-500"
                    }`}>
                    {searchQuery || selectedCategory || selectedYear
                      ? "No blogs found matching your criteria"
                      : "No blogs available"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
