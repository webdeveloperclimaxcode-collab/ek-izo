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
    <section className="w-full bg-gradient-to-r to-[#F0F3FF] from-[#FFFFFF] dark:to-[#000000] dark:from-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-bold text-[#1B2556] dark:text-white tracking-tight transition-colors">
            {t("newsBlogs.heading")}
          </h2>
        </div>

        {/* Blogs Slider */}
        <div className="relative py-8 max-w-6xl mx-auto">
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
                  <div className="bg-white dark:bg-[#000000] rounded-lg shadow-sm dark:shadow-lg overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-shadow h-full border border-gray-300 dark:border-gray-700 max-w-sm mx-auto cursor-pointer">
                    {/* Blog Image */}
                    <div className="relative h-44">
                      {blog.featuredImage ? (
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center transition-colors">
                          <span className="text-gray-400 dark:text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-5">
                      {/* Category */}
                      {blog.category && (
                        <span className="text-[11px] text-[#a8a8a8] dark:text-white uppercase tracking-wider mb-2 block transition-colors">
                          {blog.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-base font-semibold text-[#1b2556] dark:text-white mb-4 leading-snug min-h-[48px] line-clamp-2 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Date with Icon */}
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/images/services/date.svg"
                          alt="Date"
                          width={18}
                          height={18}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-[#1b2556] dark:text-white font-medium transition-colors">
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
            className="blogs-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -ml-6"
            aria-label={t("newsBlogs.prevBlog")}
          >
            <Image
              src="/assets/images/HeroSection/leftIcon.svg"
              alt="Previous"
              width={60}
              height={60}
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </button>

          <button
            className="blogs-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -mr-6"
            aria-label={t("newsBlogs.nextBlog")}
          >
            <Image
              src="/assets/images/HeroSection/righticon.svg"
              alt="Next"
              width={60}
              height={60}
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </button>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/blog"
            className="px-12 py-4 bg-gradient-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-base"
          >
            {t("newsBlogs.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
