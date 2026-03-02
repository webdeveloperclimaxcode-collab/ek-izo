"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import "swiper/css";
import "swiper/css/pagination";

interface Company {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

const companies: Company[] = [
  {
    id: "1",
    name: "BASF",
    logoUrl: "/assets/images/company_logo/basf.svg",
    websiteUrl: "https://www.basf.com"
  },
  {
    id: "2",
    name: "General Membrane",
    logoUrl: "/assets/images/company_logo/general.svg",
    websiteUrl: "https://www.generalmembrane.com"
  },
  {
    id: "3",
    name: "Italiana Membrane",
    logoUrl: "/assets/images/company_logo/italiana.svg",
    websiteUrl: "https://www.italiana.com"
  },
  {
    id: "4",
    name: "Polyglass",
    logoUrl: "/assets/images/company_logo/polyglass.svg",
    websiteUrl: "https://www.polyglass.com"
  },
  {
    id: "5",
    name: "Tessil Brenta",
    logoUrl: "/assets/images/company_logo/tessilbrenta.svg",
    websiteUrl: "https://www.tessilbrenta.com"
  }
];

export default function WeWorkWith() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleCompanyClick = (websiteUrl?: string) => {
    if (websiteUrl) {
      window.open(websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-gray-50"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-start mb-8">
          <div className="relative inline-block">
            <h2 className={`text-[36px] font-bold tracking-tight transition-colors ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {t("weWorkWith.heading")}
            </h2>
          </div>
        </div>

        {/* Companies Slider */}
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
            spaceBetween={32}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 48,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 56,
              },
            }}
            className="pb-12"
          >
            {companies.map((company) => (
              <SwiperSlide key={company.id}>
                <div
                  onClick={() => handleCompanyClick(company.websiteUrl)}
                  className={`flex items-center justify-center h-20 p-4 rounded-lg transition-all duration-300 ${theme === "dark"
                    ? "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                    : "bg-white hover:bg-gray-50"
                    } ${company.websiteUrl ? "cursor-pointer hover:shadow-md" : ""} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    width={120}
                    height={60}
                    className="w-auto h-auto max-h-12 max-w-[120px] object-contain transition-all"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="we-work-with-pagination flex justify-center gap-2 mt-6" />
        </div>
      </div>
    </section>
  );
}
