"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Spinner from "./Spinner";
import { useLanguage } from "@/contexts/LanguageContext";
import "swiper/css";
import "swiper/css/navigation";

interface BlogCategory {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  author: string;
  featuredImage: string | null;
  category: BlogCategory | null;
  publishedAt: string | null;
  createdAt: string;
}

export default function NewsBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage/blogs");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage blogs:", error);
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

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-r from-[#F0F3FF] to-[#FFFFFF] dark:from-gray-800 dark:to-gray-900 py-16 transition-colors duration-300">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }
  return (
    <section className="w-full bg-gray-50 dark:bg-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-[36px] font-bold text-brand-primary dark:text-white tracking-tight transition-colors">
              NEWS BLOGS
            </h2>
            {/* Yellow underline */}
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          </div>
        </div>

        {/* Blogs Slider */}
        <div className="relative py-8 px-16 max-w-6xl mx-auto">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".blogs-button-prev",
              nextEl: ".blogs-button-next",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <Link href={`/blog/${blog.id}`}>
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100 dark:border-gray-700 max-w-sm mx-auto cursor-pointer overflow-hidden">
                    {/* Blog Image */}
                    <div className="relative h-48">
                      <Image
                        src={blog.featuredImage || "/assets/images/blog-placeholder.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a default construction image if the featured image fails
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/images/services/s1.png";
                        }}
                      />
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      {/* Category */}
                      {blog.category && (
                        <span className="text-[12px] text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-3 block font-medium transition-colors">
                          {blog.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-[16px] font-bold text-gray-800 dark:text-white mb-4 leading-tight line-clamp-2 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Date with Icon */}
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 rounded flex items-center justify-center">
                          <Image
                            src="/assets/images/services/date.svg"
                            alt="Date"
                            width={12}
                            height={12}
                            className="w-3 h-3"
                          />
                        </div>
                        <span className="text-[14px] text-gray-600 dark:text-gray-400 font-medium transition-colors">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="blogs-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-colors"
            aria-label="Previous blog"
          >
            <svg
              className="w-6 h-6 text-white"
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
          </button>

          <button
            className="blogs-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-colors"
            aria-label="Next blog"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full transition-colors text-base"
          >
            VIEW ALL BLOGS
          </Link>
        </div>
      </div>
    </section>
  );
}
