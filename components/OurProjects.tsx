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

interface Project {
  id: string;
  title: string;
  description: string | null;
  client: string | null;
  location: string | null;
  images: string[];
}

export default function OurProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage projects:", error);
    } finally {
      setLoading(false);
    }
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

  if (projects.length === 0) {
    return null;
  }
  return (
    <section className="w-full bg-gradient-to-r to-[#F0F3FF] from-[#FFFFFF] dark:to-[#000000] dark:from-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-[36px] font-bold text-[#1E293B] dark:text-white tracking-tight mb-4 transition-colors">
            {t("ourProjects.heading")}
          </h2>
          <p className="text-base text-[#1B2556] dark:text-gray-300 max-w-4xl mx-auto leading-relaxed transition-colors">
            {t("ourProjects.description")}
          </p>
        </div>

        {/* Projects Slider */}
        <div className="relative py-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".projects-button-prev",
              nextEl: ".projects-button-next",
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
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id}>
                <Link href={`/projects/${project.id}`}>
                  <div className="bg-white dark:bg-[#000000] rounded-lg shadow-sm dark:shadow-lg overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer">
                    {/* Project Image */}
                    <div className="relative h-44">
                      {project.images && project.images.length > 0 ? (
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center transition-colors">
                          <span className="text-gray-400 dark:text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-4">
                      {/* Client with Icon - Always show for alignment */}
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src="/assets/images/ourproduts/homeicon.svg"
                          alt="Client"
                          width={18}
                          height={18}
                          className="w-4 h-4"
                        />
                        <span className="text-[11px] font-semibold text-[#64748B] dark:text-white uppercase tracking-wide transition-colors">
                          {project.client || '\u00A0'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-[#9F001B] dark:text-white mb-1 leading-tight transition-colors">
                        {project.title}
                      </h3>

                      {/* Location */}
                      {project.location && (
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white mb-1 transition-colors">
                          {project.location}
                        </p>
                      )}

                      {/* Description */}
                      {project.description && (
                        <p className="text-xs text-[#1B2556] dark:text-white line-clamp-2 transition-colors">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - Only show if there are projects */}
          {projects.length > 0 && (
            <>
              <button
                className="projects-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -ml-6"
                aria-label={t("ourProjects.prevProject")}
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
                className="projects-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -mr-6"
                aria-label={t("ourProjects.nextProject")}
              >
                <Image
                  src="/assets/images/HeroSection/righticon.svg"
                  alt="Next"
                  width={60}
                  height={60}
                  className="w-12 h-12 md:w-14 md:h-14"
                />
              </button>
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/projects"
            className="px-12 py-4 bg-gradient-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-base"
          >
            {t("ourProjects.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
