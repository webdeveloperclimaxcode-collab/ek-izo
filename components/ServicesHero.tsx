"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ServicesHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ServicesHero({ searchQuery, onSearchChange }: ServicesHeroProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background Image */}
      <div className={`absolute inset-0 z-0 ${theme === "dark" ? "brightness-50" : ""}`}>
        <Image
          src="/assets/images/Products_page/service_hero.svg"
          alt="Product Line Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 2xl:px-20 max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-white text-[48px] md:text-[56px] font-bold text-center mb-8 tracking-tight">
          {t("servicesPage.serviceLine")}
        </h1>

        {/* Search Bar - yellow background */}
        <form onSubmit={handleSearch} className="services-hero-search relative max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={t("servicesPage.searchService")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full px-8 py-5 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors 
              placeholder:text-black! placeholder:opacity-100! 
              ${theme === "dark" ? "bg-yellow-400 text-gray-800" : "bg-yellow-400 text-gray-800"}`}

            />
            <button
              type="submit"
              className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
              aria-label="Search"
            >
              <Image
                src="/assets/images/Products_page/search_icon.svg"
                alt="Search"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
