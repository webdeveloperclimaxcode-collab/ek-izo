"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ProjectsHeroProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function ProjectsHero({ searchQuery: searchQueryProp, onSearch }: ProjectsHeroProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(searchQueryProp);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full">
      {/* Hero Image */}
      <div className="relative w-full h-[300px]">
        <Image
          src="/assets/images/projects/p5.png"
          alt="Projects"
          fill
          className={`object-cover ${theme === "dark" ? "brightness-50" : ""}`}
          priority
        />
        {/* Dark Overlay */}
        {/* <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`}></div>
         */}
        {/* <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/40"}`}></div> */}

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white text-2xl md:text-[42px] lg:text-[42px] font-bold text-center leading-tight">
            {t("projectsPage.projectsHero")}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-10 transition-colors duration-300 bg-[#292929]">
        <div className="w-full px-6 2xl:px-20 mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search By Keywords"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  onSearch(value);
                }}
                onKeyDown={handleKeyPress}
                className="w-full px-6 py-3.5 text-black rounded-full focus:outline-none text-[15px] transition-colors duration-300 bg-brand-secondary placeholder:text-black! placeholder:opacity-100!"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2"
                aria-label="Search"
              >
                <Image
                  src="/assets/images/Products_page/search_icon.svg"
                  alt="Search"
                  width={18}
                  height={18}
                  className="w-4 h-4 cursor-pointer hover:opacity-80"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
