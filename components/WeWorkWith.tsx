"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Spinner from "./Spinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import "swiper/css";
import "swiper/css/pagination";

interface Company {
  id: string;
  logoUrl: string;
  websiteUrl: string | null;
}

export default function WeWorkWith() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/we-work-with");
      const data = await response.json();
      if (data.success) {
        setCompanies(data.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (websiteUrl: string | null) => {
    if (websiteUrl) {
      window.open(websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <section className={`w-full py-16 border-t border-b transition-colors duration-300 ${theme === "dark" ? "bg-[#000000] border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (companies.length === 0) {
    return null;
  }
  return (
    <section className={`w-full py-16 border-t border-b transition-colors duration-300 ${theme === "dark" ? "bg-[#000000] border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold text-[#1B2556] dark:text-white tracking-tight transition-colors">
            {t("weWorkWith.heading")}
          </h2>
        </div>

        {/* Companies Slider - logo size & spacing per Figma (smaller logos, generous gap) */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".we-work-with-pagination",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            slidesPerView={2}
            spaceBetween={48}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 64,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 80,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 96,
              },
            }}
            className="pb-10"
          >
            {companies.map((company) => (
              <SwiperSlide key={company.id}>
                <div
                  onClick={() => handleCompanyClick(company.websiteUrl)}
                  className={`flex items-center justify-center h-14 ${company.websiteUrl ? "cursor-pointer hover:opacity-75 transition-opacity" : ""}`}
                >
                  <Image
                    src={company.logoUrl}
                    alt="Company logo"
                    width={120}
                    height={120}
                    className="w-auto h-auto max-h-12 max-w-[120px] object-contain transition-all"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="we-work-with-pagination flex justify-center gap-2 mt-6" />
        </div>
      </div>
    </section>
  );
}
