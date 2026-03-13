"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogHeroProps {
  searchQuery?: string;
  selectedCategoryId?: string;
  selectedYear?: string;
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onYearChange: (year: string) => void;
}

export default function BlogHero({
  searchQuery: searchQueryProp = "",
  selectedCategoryId = "",
  selectedYear: selectedYearProp = "",
  onSearch,
  onCategoryChange,
  onYearChange,
}: BlogHeroProps) {
  const [searchQuery, setSearchQuery] = useState(searchQueryProp);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const { theme } = useTheme();

  const selectedTopicLabel = selectedCategoryId
    ? (categories.find((c) => c.id === selectedCategoryId)?.name ?? "Categories")
    : "Categories";
  const selectedYearLabel = selectedYearProp || "Years";

  useEffect(() => {
    setSearchQuery(searchQueryProp);
  }, [searchQueryProp]);

  const years = ["2025", "2024", "2023", "2022", "2021"];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/blog/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full">
      {/* Hero Image */}
      <div className="relative w-full h-[300px]">
        <Image
          src="/assets/images/blog/hero.jpg"
          alt="Blog"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/40"}`}></div>

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-[30px] lg:text-[60px] font-medium">BLOG</h1>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className={`py-10 transition-colors duration-300 bg-[#292929]`}>
        <div className="w-full px-6 2xl:px-20  mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Search Input */}
            <div className="relative flex-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search By Keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-6 py-3.5 text-black placeholder:text-black! placeholder:opacity-100! rounded-full focus:outline-none text-[15px] transition-colors duration-300 ${
                  theme === "dark"
                  ? "bg-brand-secondary"
                    : "bg-brand-secondary"
                }`}
              />
              <button onClick={handleSearch} className="absolute right-5 top-1/2 -translate-y-1/2">
                <Image
                  src="assets/images/Products_page/search_icon.svg"
                  alt="Search"
                  width={18}
                  height={18}
                  className="w-4 h-4 cursor-pointer hover:opacity-80"
                />
              </button>
            </div>

            {/* Topic Dropdown */}
            <div className="relative flex-1 min-w-0 w-full md:w-auto">
              <button
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className={`px-8 py-3.5 text-black font-semibold rounded-full hover:opacity-90 transition-all text-[15px] flex items-center gap-3 w-full justify-between min-w-0 ${theme === "dark"
                    ? "bg-brand-secondary"
                    : "bg-brand-secondary"
                  }`}
              >
                <span className="truncate">{selectedTopicLabel}</span>
                <Image
                  src="/assets/images/Products_page/dropdown_black.svg"
                  alt="Dropdown"
                  width={14}
                  height={14}
                  className={`w-3.5 h-3.5 transition-transform ${showTopicDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              {showTopicDropdown && (
                <div className={`absolute top-full mt-2 w-full rounded-lg shadow-xl z-50 transition-colors  duration-300 ${theme === "dark"
                  ? "bg-[#000000]"
                  : "bg-white"
                  }`}>
                  <button
                    onClick={() => {
                      onCategoryChange("");
                      setShowTopicDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg ${theme === "dark"
                      ? "text-white hover:bg-gray-600"
                      : "text-[#4A5568] hover:bg-gray-50"
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id);
                        setShowTopicDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors last:rounded-b-lg ${theme === "dark"
                        ? "text-white hover:bg-gray-600"
                        : "text-[#4A5568] hover:bg-gray-50"
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            {/* <div className="relative flex-1 min-w-0 w-full md:w-auto">
              <button
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className={`px-8 py-3.5 text-black font-semibold rounded-full hover:opacity-90 transition-all text-[15px] flex items-center gap-3 w-full justify-between min-w-0 ${theme === "dark"
                    ? "bg-brand-secondary"
                    : "bg-brand-secondary"
                  }`}
              >
                <span className="truncate">{selectedYearLabel}</span>
                <Image
                  src="/assets/images/Products_page/dropdown_black.svg"
                  alt="Dropdown"
                  width={14}
                  height={14}
                  className={`w-3.5 h-3.5 transition-transform ${showYearDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              {showYearDropdown && (
                <div className={`absolute top-full mt-2 w-full rounded-lg shadow-xl z-50 transition-colors duration-300 ${theme === "dark"
                  ? "bg-[#000000]"
                  : "bg-white"
                  }`}>
                  <button
                    onClick={() => {
                      onYearChange("");
                      setShowYearDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg ${theme === "dark"
                      ? "text-white hover:bg-gray-600"
                      : "text-[#4A5568] hover:bg-gray-50"
                      }`}
                  >
                    All Years
                  </button>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        onYearChange(year);
                        setShowYearDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors last:rounded-b-lg ${theme === "dark"
                        ? "text-white hover:bg-gray-600"
                        : "text-[#4A5568] hover:bg-gray-50"
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
