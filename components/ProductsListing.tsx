"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

interface Product {
  id: string;
  title: string;
  price: number | null;
  images: string[];
  sku?: string;
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

interface ProductsListingProps {
  searchQuery: string;
}

export default function ProductsListing({ searchQuery }: ProductsListingProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [visibleProducts, setVisibleProducts] = useState(20);
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

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories();
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

  // Handle URL parameters
  useEffect(() => {
    const categoryId = searchParams.get("category");
    const subcategoryId = searchParams.get("subcategory");

    if (subcategoryId) {
      setSelectedSubcategoryId(subcategoryId);
      setSelectedCategoryId(null);
      fetchProducts(undefined, subcategoryId);
    } else if (categoryId) {
      setSelectedCategoryId(categoryId);
      setSelectedSubcategoryId(null);
      fetchProducts(categoryId);
    } else {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
      fetchProducts();
    }
  }, [searchParams]);

  // Search effect
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
    } else {
      // Reset to category filter when search is cleared
      if (selectedSubcategoryId) {
        fetchProducts(undefined, selectedSubcategoryId);
      } else if (selectedCategoryId) {
        fetchProducts(selectedCategoryId);
      } else {
        fetchProducts();
      }
    }
  }, [debouncedSearchQuery]);

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

  const fetchProducts = async (
    categoryId?: string,
    subcategoryId?: string
  ) => {
    try {
      setLoading(true);
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
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=products`
      );
      const data = await response.json();
      if (data.success) {
        setFilteredProducts(data.data.products);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
    setVisibleProducts(20);
    setIsDropdownOpen(false);
    fetchProducts(categoryId);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setVisibleProducts(20);
    setIsDropdownOpen(false);
    fetchProducts(undefined, subcategoryId);
  };

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 20);
  };

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

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(checkMainScrollNeeded, 0);
    }
  }, [isDropdownOpen, categories]);

  useEffect(() => {
    if (hoveredCategory) {
      setTimeout(() => checkSubScrollNeeded(hoveredCategory), 0);
      // Calculate position based on hovered category item
      const categoryItem = categoryItemsRef.current[hoveredCategory];
      if (categoryItem && mainCategoryContainerRef.current) {
        const itemTop = categoryItem.offsetTop;
        const scrollTop = mainCategoryContainerRef.current.scrollTop;
        setSubDropdownPosition(itemTop - scrollTop);
      }
    }
  }, [hoveredCategory]);

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-[28px] font-bold mb-3 text-center transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#2D3748]"
            }`}>
            {t("productsPage.completeRange")}
          </h2>
          <p className={`text-[15px] leading-relaxed text-center max-w-4xl mx-auto mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"
            }`}>
            {t("productsPage.completeRangeDesc")}
          </p>

          {/* Browse by Product Lines Button */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-8 py-3 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full text-sm flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              {t("productsPage.browseByProductLines")}
              <Image
                src="/assets/images/Products_page/dropdown.svg"
                alt="Dropdown"
                width={16}
                height={16}
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Container */}
            {isDropdownOpen && (
              <div
                className={`absolute left-0 top-full mt-2 border rounded-lg shadow-xl z-50 flex w-fit transition-colors duration-300 ${theme === "dark"
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
                        fetchProducts();
                      }}
                    >
                      {t("productsPage.allProducts")}
                    </div>

                    {categories.map((category) => (
                      <div
                        key={category.id}
                        ref={(el) => {
                          if (el) categoryItemsRef.current[category.id] = el;
                        }}
                        className={`px-4 py-3 cursor-pointer text-sm font-medium border-b flex items-center justify-between transition-colors duration-300 ${hoveredCategory === category.id
                          ? theme === "dark"
                            ? "bg-gray-700 text-[#9F001B]"
                            : "bg-gray-50 text-[#9F001B]"
                          : theme === "dark"
                            ? "hover:bg-gray-700 text-gray-300 border-gray-700"
                            : "hover:bg-gray-50 text-[#4A5568] border-gray-100"
                          }`}
                        onClick={() => handleCategoryClick(category.id)}
                        onMouseEnter={() => {
                          setHoveredCategory(category.id);
                          checkSubScrollNeeded(category.id);
                          // Calculate position for subcategory
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={`rounded-[15px] overflow-hidden hover:shadow-xl transition-all border transition-colors duration-300 ${theme === "dark"
                  ? "bg-[#000000] border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200"
                  }`}
              >
                {/* Product Image */}
                <div className={`relative h-[240px] rounded-b-[15px] border-b border-l border-r overflow-hidden transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className={`p-6 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
                  {/* Product Name with Border */}
                  <div className="border-l-4 border-[#9F001B] pl-4 mb-6">
                    <h3 className={`text-[16px] font-bold leading-tight uppercase transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"
                      }`}>
                      {product.title}
                    </h3>
                  </div>

                  {/* Price and Cart Icon */}
                  <div className="flex items-center justify-between min-h-[52px]">
                    {product.price && (
                      <div className={`text-[28px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#9F001B]"}`}>
                        ${product.price}
                      </div>
                    )}
                    {product.enableOnlineSales && (
                      <button
                        className="flex items-center justify-center hover:opacity-90 transition-opacity ml-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          if (product.price) {
                            addToCart({
                              type: "product",
                              id: product.id,
                              title: product.title,
                              price: product.price,
                              image: product.images[0] || "/placeholder.png",
                              sku: product.sku,
                            });
                          } else {
                            alert("Please contact us for pricing on this product");
                          }
                        }}
                      >
                        <Image
                          src="/assets/images/ourproduts/shop.svg"
                          alt="Add to cart"
                          width={52}
                          height={52}
                          className="w-[52px] h-[52px]"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{t("productsPage.noProductsFound")}</p>
          </div>
        )}

        {/* View More Products Button */}
        {!loading &&
          filteredProducts.length > visibleProducts && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-12 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-base"
              >
                {t("productsPage.viewMoreProducts")}
              </button>
            </div>
          )}
      </div>
    </section >
  );
}
