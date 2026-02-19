"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "@/app/lib/hooks/useTranslation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedProduct {
  id: number;
  nameKey: string;
  descriptionKey: string;
  image: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    nameKey: "featuredProducts.products.floorTenax.name",
    descriptionKey: "featuredProducts.products.floorTenax.description",
    image: "/assets/images/ourproduts/p1.png",
  },
  {
    id: 2,
    nameKey: "featuredProducts.products.readymesh.name",
    descriptionKey: "featuredProducts.products.readymesh.description",
    image: "/assets/images/services/s1.png",
  },
  {
    id: 3,
    nameKey: "featuredProducts.products.sanadek.name",
    descriptionKey: "featuredProducts.products.sanadek.description",
    image: "/assets/images/ourproduts/p2.png",
  },
  {
    id: 4,
    nameKey: "featuredProducts.products.protechSigilflex.name",
    descriptionKey: "featuredProducts.products.protechSigilflex.description",
    image: "/assets/images/services/s2.png",
  },
  {
    id: 5,
    nameKey: "featuredProducts.products.thermalInsulation.name",
    descriptionKey: "featuredProducts.products.thermalInsulation.description",
    image: "/assets/images/services/s3.png",
  },
];

export default function FeaturedProducts() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-linear-to-r from-[#F0F3FF] to-[#FFFFFF] dark:from-[#000000] dark:to-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-bold text-[#1B2556] dark:text-white tracking-tight transition-colors">
            {t("featuredProducts.heading")}
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".featured-button-prev",
              nextEl: ".featured-button-next",
            }}
            pagination={{
              clickable: true,
              el: ".featured-pagination",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="pb-12"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div style={{ border: "1.5px solid #e1e1e1" }} className="bg-white dark:bg-[#000000] rounded-[7px] h-full overflow-hidden flex items-center transition-colors dark:border-gray-700">
                  {/* Product Image - Left Side */}
                  <div className="relative w-[140px] h-[160px] shrink-0">
                    <Image
                      src={product.image}
                      alt={t(product.nameKey)}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info - Right Side */}
                  <div className="flex-1 p-5 pr-6">
                    <h3 className="text-[17px] font-bold text-[#1B2556] dark:text-white mb-2 leading-tight transition-colors">
                      {t(product.nameKey)}
                    </h3>
                    <p className="text-[13px] text-[#64748B] dark:text-white leading-relaxed line-clamp-2 transition-colors">
                      {t(product.descriptionKey)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - Only show if there are items */}
          {featuredProducts.length > 0 && (
            <>
              <button
                className="featured-button-prev absolute left-[-10px] top-18 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -ml-4"
                aria-label={t("featuredProducts.prevProduct")}
              >
                <Image
                  src="/assets/images/HeroSection/leftIcon.svg"
                  alt="Previous"
                  width={60}
                  height={60}
                  className="w-10 h-10 md:w-14 md:h-8"
                />
              </button>

              <button
                className="featured-button-next absolute right-[-10px] top-18 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -mr-4"
                aria-label={t("featuredProducts.nextProduct")}
              >
                <Image
                  src="/assets/images/HeroSection/righticon.svg"
                  alt="Next"
                  width={60}
                  height={60}
                  className="w-12 h-12 md:w-14 md:h-8"
                />
              </button>
            </>
          )}

          {/* Custom Pagination */}
          <div className="featured-pagination flex justify-center gap-2 mt-3"></div>
        </div>
      </div>
    </section>
  );
}
