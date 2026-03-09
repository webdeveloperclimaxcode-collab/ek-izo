"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "./Spinner";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Product {
  id: string;
  title: string;
  price: number | null;
  images: string[];
  subcategoryId: string | null;
  subcategory?: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  client: string | null;
  location: string | null;
  completionDate: string | null;
  duration: string | null;
  images: string[];
  featured: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  subcategoryId: string | null;
  subcategory?: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface SearchResults {
  products: Product[];
  projects: Project[];
  services: Service[];
  total: number;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export default function SearchPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"search" | "browse">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  // Read initial query from URL on mount and keep URL in sync with query and tab
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    if (query !== null && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const currentQ = params.get("q") ?? "";
    const currentType = params.get("type") ?? (activeTab === "browse" ? "products" : "all");
    const nextType = activeTab === "browse" ? "products" : "all";
    // Avoid overwriting URL on initial load when q is in URL but state not yet synced
    if (currentQ && !searchQuery.trim()) return;
    if (currentQ === searchQuery.trim() && currentType === nextType) return;
    const next = new URLSearchParams();
    if (searchQuery.trim()) {
      next.set("q", searchQuery.trim());
      next.set("type", nextType);
    }
    const url = next.toString() ? `/search?${next.toString()}` : "/search";
    router.replace(url, { scroll: false });
  }, [searchQuery, activeTab]);

  // Browse tab states
  const [categories, setCategories] = useState<Category[]>([]);
  const [browseProducts, setBrowseProducts] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [browseLoading, setBrowseLoading] = useState(false);

  // Debounce the search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const performSearch = async (
    query: string,
    searchType: "all" | "products" = "all",
    categoryId?: string | null,
    subcategoryId?: string | null
  ) => {
    if (!query.trim()) {
      setResults(null);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const params = new URLSearchParams({
        q: query.trim(),
        type: searchType,
      });
      if (searchType === "products" && subcategoryId) params.set("subcategoryId", subcategoryId);
      else if (searchType === "products" && categoryId) params.set("categoryId", categoryId);
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when debounced query or tab/filters change
  useEffect(() => {
    if (debouncedSearchQuery) {
      const searchType = activeTab === "browse" ? "products" : "all";
      const catId = activeTab === "browse" ? selectedCategoryId : null;
      const subId = activeTab === "browse" ? selectedSubcategoryId : null;
      performSearch(debouncedSearchQuery, searchType, catId, subId);
    } else {
      setResults(null);
      setHasSearched(false);
    }
  }, [debouncedSearchQuery, activeTab, selectedCategoryId, selectedSubcategoryId]);

  // Fetch categories when browse tab is active
  useEffect(() => {
    if (activeTab === "browse" && categories.length === 0) {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrowseProducts = async (categoryId?: string, subcategoryId?: string) => {
    try {
      setBrowseLoading(true);
      let url = "/api/products";
      const params = new URLSearchParams();

      if (subcategoryId) {
        params.append("subcategoryId", subcategoryId);
      } else if (categoryId) {
        params.append("categoryId", categoryId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setBrowseProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setBrowseLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
    setIsDropdownOpen(false);
    fetchBrowseProducts(categoryId);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setIsDropdownOpen(false);
    fetchBrowseProducts(undefined, subcategoryId);
  };

  const handleAllProductsClick = () => {
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setIsDropdownOpen(false);
    fetchBrowseProducts();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchType = activeTab === "browse" ? "products" : "all";
    const catId = activeTab === "browse" ? selectedCategoryId : null;
    const subId = activeTab === "browse" ? selectedSubcategoryId : null;
    performSearch(searchQuery, searchType, catId, subId);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      {/* Header Section */}
      <div className={`w-full py-8 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Tab Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-8 py-3 font-semibold rounded-full text-[15px] transition-colors ${activeTab === "search"
                  ? "bg-[#F6BA40] text-white"
                  : theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-[#4A5568] hover:bg-gray-300"
                  }`}
              >
                {t("searchPage.searchTheSite")}
              </button>
              {/* <button
                onClick={() => setActiveTab("browse")}
                className={`px-8 py-3 font-semibold rounded-full text-[15px] transition-colors ${activeTab === "browse"
                  ? "bg-[#F6BA40] text-white"
                  : theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-[#4A5568] hover:bg-gray-300"
                  }`}
              >
                {t("searchPage.browseByProductLine")}
              </button> */}
            </div>

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              <Image
                src="/assets/images/header/closeicon.svg"
                alt="Close"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="w-full bg-[#F6BA40] py-8">
        <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            {/* Search Icon on the left */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image
                src="/assets/images/header/search_icon.svg"
                alt="Search"
                width={20}
                height={20}
                className="w-5 h-5 opacity-40"
              />
            </div>

            <input
              type="text"
              placeholder={
                activeTab === "search"
                  ? t("searchPage.searchPlaceholder")
                  : t("searchPage.browseSearchPlaceholder")
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-14 py-5 rounded-full focus:outline-none text-[16px] shadow-lg transition-colors ${theme === "dark"
                ? "bg-gray-700 text-white placeholder:text-gray-400"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF]"
                }`}
            />

            {/* Clear button (shows when there's text) */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              >
                <Image
                  src="/assets/images/header/closeicon.svg"
                  alt="Clear"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto py-16">
        {activeTab === "search" ? (
          <>
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Spinner size="lg" />
                <p className={`text-[15px] mt-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{t("searchPage.searching")}</p>
              </div>
            )}

            {/* Initial State - No Search Yet */}
            {!loading && !hasSearched && (
              <div className="text-center">
                <p className={`text-[18px] mb-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                  {t("searchPage.enterSearchTerm")}
                </p>
                <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-[#9CA3AF]"}`}>
                  {t("searchPage.resultsWillAppear")}
                </p>
              </div>
            )}

            {/* Search Results */}
            {!loading && hasSearched && results && (
              <div>
                {/* Results Summary */}
                <div className="mb-8">
                  <h2 className={`text-[24px] font-bold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"}`}>
                    {t("searchPage.searchResultsFor")} "{searchQuery}"
                  </h2>
                  <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                    {t("searchPage.found")} {results.total} {results.total !== 1 ? t("searchPage.results") : t("searchPage.results")}
                    (
                    {/* {results.products.length} */}
                    {/* {results.products.length !== 1 ? t("searchPage.products") : t("searchPage.product")}, */}
                    {results.services.length} {results.services.length !== 1 ? t("searchPage.services") : t("searchPage.service")}, {results.projects.length} {results.projects.length !== 1 ? t("searchPage.projects") : t("searchPage.project")})
                  </p>
                </div>

                {/* No Results */}
                {results.total === 0 && (
                  <div className="text-center py-12">
                    <p className={`text-[18px] mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                      {t("searchPage.noResultsFound")} "{searchQuery}"
                    </p>
                    <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-[#9CA3AF]"}`}>
                      {t("searchPage.tryDifferentKeywords")}
                    </p>
                  </div>
                )}



                {/* Services Section */}
                {results.services.length > 0 && (
                  <div className="mb-12">
                    <h3 className={`text-[20px] font-bold mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"}`}>
                      {t("searchPage.services")} ({results.services.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all transition-colors duration-300 ${theme === "dark"
                            ? "bg-[#000000] border-gray-700"
                            : "bg-white border-gray-200"
                            }`}
                        >
                          {/* Service Image */}
                          <div className={`relative h-48 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            {service.images && service.images.length > 0 ? (
                              <Image
                                src={service.images[0]}
                                alt={service.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className={`flex items-center justify-center h-full ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Service Info */}
                          <div className="p-4">
                            <span className="text-[11px] font-semibold text-[#000] uppercase tracking-wider mb-2 block">
                              {t("searchPage.service")}
                            </span>
                            <h4 className={`text-sm font-semibold mb-3 min-h-[40px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"}`}>
                              {service.title}
                            </h4>
                            {service.description && (
                              <p className={`text-[13px] line-clamp-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                                {service.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <div>
                    <h3 className={`text-[20px] font-bold mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"}`}>
                      {t("searchPage.projects")} ({results.projects.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all h-full flex flex-col transition-colors duration-300 ${theme === "dark"
                            ? "bg-[#000000] border-gray-700"
                            : "bg-white border-gray-200"
                            }`}
                        >
                          {/* Project Image */}
                          <div className={`relative h-64 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            {project.images && project.images.length > 0 ? (
                              <Image
                                src={project.images[0]}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>No Image</span>
                              </div>
                            )}
                          </div>

                          {/* Project Info */}
                          <div className="p-5 flex-1 flex flex-col">
                            {project.client && (
                              <span className="text-[11px] font-semibold text-[#000] uppercase tracking-wider mb-2 block">
                                {project.client}
                              </span>
                            )}

                            <h4 className={`text-[18px] font-bold mb-2 transition-colors ${theme === "dark" ? "text-white" : "text-[#000]"}`}>
                              {project.title}
                            </h4>

                            {project.location && (
                              <p className={`text-[14px] font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"}`}>
                                {project.location}
                              </p>
                            )}

                            {project.description && (
                              <p className={`text-[13px] line-clamp-3 mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                                {project.description}
                              </p>
                            )}

                            {project.duration && (
                              <p className={`text-[12px] mt-auto transition-colors ${theme === "dark" ? "text-white" : "text-[#000]"}`}>
                                Duration: {project.duration}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Browse by Product Line Section - Disabled */}
            <div className="text-center py-12">
              <p className={`text-[18px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                Product browsing is currently disabled.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
