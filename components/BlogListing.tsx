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
  images: string[];
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

const BLOGS_PER_PAGE = 9;

export default function BlogListing({ searchQuery, selectedCategory, selectedYear }: BlogListingProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { theme } = useTheme();

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setHasMore(false);
    fetchBlogs(1, true);
  }, [searchQuery, selectedCategory, selectedYear]);

  const fetchBlogs = async (pageNum: number, isReset: boolean) => {
    try {
      if (isReset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const params = new URLSearchParams();

      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (selectedYear) params.append("year", selectedYear);
      params.append("page", pageNum.toString());
      params.append("limit", BLOGS_PER_PAGE.toString());

      const response = await fetch(`/api/blog?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setBlogs((prev) => (isReset ? data.data : [...prev, ...data.data]));
        setHasMore(data.hasMore ?? false);
      } else {
        if (isReset) setBlogs([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (isReset) setBlogs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, false);
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
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20  mx-auto">
        {/* Description */}
        <p className={`text-[15px] lg:text-4xl text-center mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
          Press releases, press kits and other content for journalists
        </p>
       <div className="flex justify-center item-center w-full">
          {/* <button  className={`text-[15px] rounded-full lg:text-2xl p-6 lg:py-4 border border-[#F6BA40] text-center mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
          Consult The Media Area
        </button > */}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-15">
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
                      {blog.images && blog.images.length > 0 ? (
                        <>
                          <div className="absolute z-0 bg-black/75 w-full h-full flex items-center justify-center">
                  <Image
                    src="/assets/images/loader/loader.svg"
                    alt="Placeholder"
                    width={80}
                    height={80}
                    className="w-12 h-12 "
                  />  
                </div>
                        <Image
                          src={blog.images[0]}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        </>
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
                    <div className="p-5 flex-1 flex gap-7 flex-col">
                      {/* Category */}
                      {blog.category && (
                        <span className={`text-[11px]  lg:text-base uppercase  mb-3 block transition-colors duration-300 text-[#F6BA40] truncate`}>
                          {blog.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className={`text-[16px] lg:-mt-5 lg:text-2xl font-normal truncate mb-3 leading-tight line-clamp-2 flex-1 transition-colors duration-300 ${theme === "dark"
                        ? "text-white"
                        : "text-brand-primary"
                        }`}>
                        {blog.title}
                      </h3>

                      {/* Author */}
                      {/* <p className={`text-[13px] lg:text-base mb-3 transition-colors duration-300 ${theme === "dark"
                        ? "text-white"
                        : "text-[#6B7280]"
                        }`}>
                        By {blog.author}
                      </p> */}

                      {/* Date with Icon */}

                      {/* white date icon  */}
                      {/* /assets/images/services/date_white.svg */}
                      <div className="flex items-center gap-2 mt-auto">
                        <Image
                          src={theme === "dark" ? "/assets/images/services/date_yellow.svg" : "/assets/images/services/date_yellow.svg"}
                          alt="Date"
                          width={18}
                          height={18}
                          className="w-[18px] h-[18px]"
                        />
                        <span className={`text-[13px] lg:text-base font-medium transition-colors duration-300 ${theme === "dark"
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

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`text-[15px] rounded-full lg:text-2xl px-10 py-4 border border-[#F6BA40] text-center transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-brand-primary"
                  } ${loadingMore ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F6BA40]/10"}`}
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
