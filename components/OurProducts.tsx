"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  title: string;
  price: number | null;
  images: string[];
  sku?: string;
  enableOnlineSales: boolean;
}

export default function OurProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-[#000000] py-16 transition-colors duration-300">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-linear-to-r from-[#FFFFFF] to-[#F0F3FF] dark:from-[#000000] dark:to-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-bold text-brand-primary dark:text-white tracking-tight transition-colors">
            {t("ourProducts.heading")}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white dark:bg-[#000000] rounded-[15px] border-[1.5px] overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              {/* Product Image */}
              <div className="relative h-[240px] 
  rounded-b-[15px] 
  border-b border-l border-r border-gray-200 
  overflow-hidden ">
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
              <div className="p-6 bg-white dark:bg-[#000000] transition-colors">
                {/* Product Name with Border */}
                <div className="border-l-4 border-brand-secondary pl-4 mb-6">
                  <h3 className="text-[16px] font-bold text-brand-primary dark:text-white leading-tight uppercase transition-colors">
                    {product.title}
                  </h3>
                </div>

                {/* Price and Cart Icon */}
                <div className="flex items-center justify-between min-h-[52px]">
                  {product.price && (
                    <div className="text-[28px] font-semibold text-brand-secondary dark:text-white transition-colors">
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
                          // Handle products without price - show contact message
                          alert(t("ourProducts.contactForPricing"));
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

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/products"
            className="px-12 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg"
          >
            {t("ourProducts.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}