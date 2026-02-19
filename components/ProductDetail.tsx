"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import Spinner from "./Spinner";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  images: string[];
  enableOnlineSales: boolean;
}

export default function ProductDetail({ productId }: { productId: string }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const thumbnailSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Sync thumbnail carousel when main image changes (must be before any early return to keep hook order)
  useEffect(() => {
    thumbnailSwiperRef.current?.slideTo(selectedImage);
  }, [selectedImage]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto text-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto text-center">
          <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{t("productsPage.productNotFound")}</p>
        </div>
      </section>
    );
  }

  const productImages = product.images.length > 0 ? product.images : ["/assets/images/services/s1.png"];

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`flex items-center cursor-pointer gap-2 mb-6 transition-colors group ${theme === "dark"
            ? "text-gray-300 hover:text-[#9F001B]"
            : "text-[#1B2556] hover:text-[#9F001B]"
            }`}
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-[16px] font-semibold transition-colors">{t("productsPage.back")}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Product Images */}
          <div>
            {/* Main Image */}
            <div className={`relative rounded-[10px] h-[550px] mb-6 transition-colors duration-300 ${theme === "dark"
              ? "border-gray-700"
              : "border-[#D4D4D4]"
              }`} style={{ border: theme === "dark" ? "2px solid #4b5563" : "2px solid #D4D4D4" }}>
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                fill
                className="rounded-[10px] object-cover"

              />

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev > 0 ? prev - 1 : productImages.length - 1
                      )
                    }
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src="/assets/images/Products_page/slider_left_arrow.svg"
                      alt="Previous"
                      width={48}
                      height={48}
                      className="w-10"
                    />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev < productImages.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src="/assets/images/Products_page/slider_right_arrow.svg"
                      alt="Next"
                      width={48}
                      height={48}
                      className="w-10"
                    />
                  </button>
                </>
              )}

              {/* Price and Cart */}
              <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
                <span className={`px-10 py-1.5 rounded-4xl text-2xl transition-colors duration-300 ${theme === "dark" ? "text-white bg-gray-800" : "text-[#9F001B] bg-[#fff5f7]"}`}>
                  $${product.price}
                </span>
                {product.enableOnlineSales && (
                  <button
                    onClick={() => {
                      if (product.price) {
                        addToCart({
                          type: "product",
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: productImages[0] || "/placeholder.png",
                        });
                      } else {
                        alert(t("ourProducts.contactForPricing"));
                      }
                    }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <Image
                      src="/assets/images/Products_page/cart.svg"
                      alt="Cart"
                      width={56}
                      height={56}
                      className="w-12"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail Images - Swiper carousel with arrows to display all images */}
            {productImages.length > 1 && (
              <div className="relative">
                <Swiper
                  onSwiper={(swiper) => { thumbnailSwiperRef.current = swiper; }}
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".product-thumb-prev",
                    nextEl: ".product-thumb-next",
                  }}
                  slidesPerView={3}
                  spaceBetween={16}
                  loop={productImages.length >= 3}
                  className="rounded-2xl"
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 24 },
                  }}
                >
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-32 w-full rounded-2xl overflow-hidden transition-all block ${selectedImage === index
                          ? `border-[3px] ${theme === "dark" ? "border-gray-400" : "border-[#1B2556]"}`
                          : `border-[3px] ${theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-300 hover:border-gray-400"}`
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Thumbnail carousel arrows - same style as main image */}
                <button
                  type="button"
                  className="product-thumb-prev absolute left-[-12px] top-1/2 -translate-y-1/2 z-10 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                  aria-label="Previous thumbnails"
                >
                  <Image
                    src="/assets/images/Products_page/slider_left_arrow.svg"
                    alt="Previous"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </button>
                <button
                  type="button"
                  className="product-thumb-next absolute right-[-12px] top-1/2 -translate-y-1/2 z-10 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
                  aria-label="Next thumbnails"
                >
                  <Image
                    src="/assets/images/Products_page/slider_right_arrow.svg"
                    alt="Next"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div>
            <h1 className={`text-[32px] font-bold mb-4 leading-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              {product.title}
            </h1>

            {product.description && (
              <div className={`text-[14px] leading-relaxed mb-6 whitespace-pre-line transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#9CA3AF]"}`}>
                {product.description}
              </div>
            )}

            {/* Action Buttons */}
            {/* <div className="space-y-3">
              <button className=" px-8 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white  rounded-full hover:opacity-90 transition-opacity text-[15px]">
                DISCOVER THE PROFILE COMBINATIONS
              </button>
              <button className=" px-8 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white  rounded-full hover:opacity-90 transition-opacity text-[15px]">
                INFO CO2 FULLY OFFSET
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
