"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

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

interface Service {
  id: string;
  title: string;
  price: number | null;
  images: string[];
  subcategoryId: string | null;
  enableOnlineSales: boolean;
  subcategory?: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface ServicesListingProps {
  searchQuery: string;
}

export default function ServicesListing({ searchQuery }: ServicesListingProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [visibleServices, setVisibleServices] = useState(20);
  const [loading, setLoading] = useState(true);
  const [showMainScrollArrows, setShowMainScrollArrows] = useState(false);
  const [showSubScrollArrows, setShowSubScrollArrows] = useState<{
    [key: string]: boolean;
  }>({});
  const [subDropdownPosition, setSubDropdownPosition] = useState(0);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const mainCategoryContainerRef = useRef<HTMLDivElement>(null);
  const subcategoryContainerRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const categoryItemsRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHoveredCategory(null);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(checkMainScrollNeeded, 0);
    }
  }, [isDropdownOpen, categories]);

  useEffect(() => {
    if (hoveredCategory) {
      setTimeout(() => checkSubScrollNeeded(hoveredCategory), 0);
      if (categoryItemsRef.current[hoveredCategory]) {
        const itemTop = categoryItemsRef.current[hoveredCategory].offsetTop;
        setSubDropdownPosition(itemTop);
      }
    }
  }, [hoveredCategory]);

  const checkMainScrollNeeded = () => {
    if (mainCategoryContainerRef.current) {
      const hasScroll =
        mainCategoryContainerRef.current.scrollHeight >
        mainCategoryContainerRef.current.clientHeight;
      setShowMainScrollArrows(hasScroll);
    }
  };

  const checkSubScrollNeeded = (categoryId: string) => {
    const ref = subcategoryContainerRef.current[categoryId];
    if (ref) {
      const hasScroll = ref.scrollHeight > ref.clientHeight;
      setShowSubScrollArrows((prev) => ({
        ...prev,
        [categoryId]: hasScroll,
      }));
    }
  };

  // Search effect
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
    } else {
      // Reset to category filter when search is cleared
      if (selectedSubcategoryId) {
        fetchServices(undefined, selectedSubcategoryId);
      } else if (selectedCategoryId) {
        fetchServices(selectedCategoryId);
      } else {
        fetchServices();
      }
    }
  }, [debouncedSearchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/services/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching service categories:", error);
    }
  };

  const fetchServices = async (
    categoryId?: string,
    subcategoryId?: string
  ) => {
    try {
      setLoading(true);
      let url = "/api/services";
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
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=services`
      );
      const data = await response.json();
      if (data.success) {
        setFilteredServices(data.data.services);
      }
    } catch (error) {
      console.error("Error searching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
    setVisibleServices(20);
    setIsDropdownOpen(false);
    fetchServices(categoryId);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setVisibleServices(20);
    setIsDropdownOpen(false);
    fetchServices(undefined, subcategoryId);
  };

  const loadMore = () => {
    setVisibleServices((prev) => prev + 20);
  };

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-[28px] font-bold mb-3 text-center transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"
            }`}>
            {t("servicesPage.completeRange")}
          </h2>
          <p className={`text-[15px] leading-relaxed text-center max-w-4xl mx-auto mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"
            }`}>
            {t("servicesPage.completeRangeDesc")}
          </p>

          {/* Browse by Service Lines Button */}
          <div className="flex justify-center">
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-8 py-3 bg-brand-gradient text-black font-semibold rounded-full text-sm flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                {t("servicesPage.browseByServiceLines")}
                <Image
                  src="/assets/images/Products_page/dropdown.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform filter brightness-0 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Container */}
              {isDropdownOpen && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 border rounded-lg shadow-xl z-50 flex w-fit transition-colors duration-300 ${theme === "dark"
                    ? "bg-[#000000] border-gray-700"
                    : "bg-white border-gray-200"
                    }`}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Left Panel - Categories */}
                  <div className={`w-96 border-r transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}>
                    {/* Up Arrow */}
                    {showMainScrollArrows && (
                      <div className={`flex justify-center py-2 border-b transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                        }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (mainCategoryContainerRef.current) {
                              mainCategoryContainerRef.current.scrollTop -= 40;
                            }
                          }}
                          className="hover:opacity-70"
                        >
                          <Image
                            src="/assets/images/Products_page/slider_left_arrow.svg"
                            alt="Up"
                            width={16}
                            height={16}
                            className="w-4 h-4 rotate-90"
                          />
                        </button>
                      </div>
                    )}

                    {/* Categories List */}
                    <div
                      ref={mainCategoryContainerRef}
                      className="max-h-[600px] overflow-y-scroll"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                      <div
                        className={`px-4 py-3 cursor-pointer text-sm font-medium border-b transition-colors duration-300 ${theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300 border-gray-700"
                          : "hover:bg-gray-50 text-[#4A5568] border-gray-100"
                          }`}
                        onClick={() => {
                          setSelectedCategoryId(null);
                          setSelectedSubcategoryId(null);
                          setIsDropdownOpen(false);
                          fetchServices();
                        }}
                      >
                        {t("servicesPage.allServices")}
                      </div>

                      {categories.map((category) => (
                        <div
                          key={category.id}
                          ref={(el) => {
                            if (el) categoryItemsRef.current[category.id] = el;
                          }}
                          className={`px-4 py-3 cursor-pointer text-sm font-medium border-b flex items-center justify-between transition-colors duration-300 ${hoveredCategory === category.id
                            ? theme === "dark"
                              ? "bg-gray-700 text-brand-secondary"
                              : "bg-gray-50 text-brand-secondary"
                            : theme === "dark"
                              ? "hover:bg-gray-700 text-gray-300 border-gray-700"
                              : "hover:bg-gray-50 text-[#4A5568] border-gray-100"
                            }`}
                          onClick={() => handleCategoryClick(category.id)}
                          onMouseEnter={() => {
                            setHoveredCategory(category.id);
                            checkSubScrollNeeded(category.id);
                            if (categoryItemsRef.current[category.id]) {
                              const itemTop = categoryItemsRef.current[category.id].offsetTop;
                              setSubDropdownPosition(itemTop);
                            }
                          }}
                        >
                          <span>{category.name}</span>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <Image
                              src="/assets/images/Products_page/ritharrow.svg"
                              alt="Arrow"
                              width={12}
                              height={12}
                              className="w-3 h-3"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Down Arrow */}
                    {showMainScrollArrows && (
                      <div className={`flex justify-center py-2 border-t transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                        }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (mainCategoryContainerRef.current) {
                              mainCategoryContainerRef.current.scrollTop += 40;
                            }
                          }}
                          className="hover:opacity-70"
                        >
                          <Image
                            src="/assets/images/Products_page/slider_left_arrow.svg"
                            alt="Down"
                            width={16}
                            height={16}
                            className="w-4 h-4 -rotate-90"
                          />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Panel - Subcategories */}
                  {hoveredCategory && categories.find((c) => c.id === hoveredCategory)?.subcategories && (
                    <div
                      className="w-80 absolute left-full top-0 ml-0"
                      style={{ top: `${subDropdownPosition}px` }}
                      onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {/* Up Arrow */}
                      {showSubScrollArrows[hoveredCategory] && (
                        <div className={`flex justify-center py-2 border-b transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                          }`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const ref = subcategoryContainerRef.current[hoveredCategory];
                              if (ref) ref.scrollTop -= 40;
                            }}
                            className="hover:opacity-70"
                          >
                            <Image
                              src="/assets/images/Products_page/slider_left_arrow.svg"
                              alt="Up"
                              width={16}
                              height={16}
                              className="w-4 h-4 rotate-90"
                            />
                          </button>
                        </div>
                      )}

                      {/* Subcategories List */}
                      <div
                        ref={(el) => {
                          if (el && hoveredCategory) {
                            subcategoryContainerRef.current[hoveredCategory] = el;
                          }
                        }}
                        className={`max-h-96 overflow-y-scroll border rounded-lg transition-colors duration-300 ${theme === "dark"
                          ? "bg-[#000000] border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {categories
                          .find((c) => c.id === hoveredCategory)
                          ?.subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className={`px-4 py-3 cursor-pointer text-sm border-b last:border-b-0 transition-colors duration-300 ${theme === "dark"
                                ? "hover:bg-gray-700 text-gray-300 border-gray-700"
                                : "hover:bg-gray-50 text-[#4A5568] border-gray-100"
                                }`}
                              onClick={() => handleSubcategoryClick(sub.id)}
                            >
                              {sub.name}
                            </div>
                          ))}
                      </div>

                      {/* Down Arrow */}
                      {showSubScrollArrows[hoveredCategory] && (
                        <div className={`flex justify-center py-2 border-t transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                          }`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const ref = subcategoryContainerRef.current[hoveredCategory];
                              if (ref) ref.scrollTop += 40;
                            }}
                            className="hover:opacity-70"
                          >
                            <Image
                              src="/assets/images/Products_page/slider_left_arrow.svg"
                              alt="Down"
                              width={16}
                              height={16}
                              className="w-4 h-4 -rotate-90"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Services Grid */}
        {!loading && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredServices.slice(0, visibleServices).map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className={`rounded-lg overflow-hidden hover:shadow-lg transition-all border group ${theme === "dark"
                  ? "bg-[#1a1a1a] border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
              >
                {/* Service Image */}
                <div className="relative h-[200px] overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`flex items-center justify-center h-full transition-colors ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                      <span className={`transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No Image</span>
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="p-6">
                  {/* Service Title */}
                  <h3 className={`text-[18px] font-bold mb-3 leading-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-gray-800"
                    }`}>
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className={`text-[14px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                    Ideal for waterproofing and thermal insulation of terraces and special covers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Services */}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{t("servicesPage.noServicesFound")}</p>
          </div>
        )}

        {/* View All Services Button */}
        {!loading && filteredServices.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/services"
              className="px-12 py-4 border-2 border-yellow-400 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-yellow-400 hover:text-black transition-all text-base"
            >
              VIEW ALL SERVICES
            </Link>
          </div>
        )}

        {/* View More Services Button */}
        {!loading &&
          filteredServices.length > visibleServices && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-12 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-base"
              >
                {t("servicesPage.viewMoreServices")}
              </button>
            </div>
          )}
      </div>
    </section>
  );
}
