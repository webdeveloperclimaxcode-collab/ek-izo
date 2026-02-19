"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export default function AboutHero() {
  const { theme } = useTheme();

  return (
    <section className={`w-full transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      {/* Hero Image - same overlay/appearance in dark and light mode */}
      <div className="relative w-full h-[430px]">
        <Image
          src="/assets/images/about/AboutHero2.png"
          alt="Building Today With The Future In Mind"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Section ***************/}
      <div className="w-full px-6 2xl:px-20 max-w-6xl mx-auto py-12">
        {/* Title */}
        <h1 className={`text-[32px] font-bold text-center mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1b2556]"}`}>
          Building Today With The Future In Mind
        </h1>

        {/* Description */}
        <p className={`text-[16px] leading-relaxed text-center max-w-5xl mx-auto mb-12 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
          Izogrup builds today with the future in mind powered by enthusiasm,
          teamwork, and forward-thinking. As a leading provider of construction
          solutions, we deliver durable, high-quality products designed to
          protect both people and the planet. From major architectural projects
          to the restoration of historic buildings, our expertise supports
          sustainable, innovative construction every day.
        </p>

        {/* Video Section */}
        <div className={`relative w-full h-[450px] rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 ${theme === "dark"
          ? "bg-linear-to-r from-gray-800 to-gray-700"
          : "bg-linear-to-r to-[#F0F3FF] from-[#FFFFFF]"
          }`}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Grouting And Exalting Ceramic Tiles | Quick-Drying...."
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* Copy Link Button */}
          <button className={`absolute top-4 right-4 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-md ${theme === "dark"
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-white text-[#2D3748] hover:bg-gray-50"
            }`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Link
          </button>
        </div>
      </div>
    </section>
  );
}
