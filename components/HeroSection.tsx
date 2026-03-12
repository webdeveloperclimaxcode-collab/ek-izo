"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Spinner from "./Spinner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroSlide {
  id: string;
  title: string;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sliders");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative w-full h-[300px] md:h-[600px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <Spinner size="lg" />
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
        }}
        autoplay={{
          delay: 9000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">

              {/* Background Image Wrapper */}
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">

                {/* 1. Spinner stays in the background while loading */}
                <div className="absolute z-0 bg-black/75 w-full h-full flex items-center justify-center">
                  <Image
                    src="/assets/images/loader/loader.svg"
                    alt="Placeholder"
                    width={80}
                    height={80}
                    className="w-12 h-12 "
                  />  
                </div>

                {/* 2. Actual Image (Covers spinner when loaded) */}
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || "Hero Slide"}
                  fill
                  className="object-cover relative z-10"
                  priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  // If image breaks, we can hide it so the background spinner/color shows
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Content Card - Only show if there's text */}
              {(slide.title || slide.description || slide.buttonText) && (
                <div className="absolute z-20 inset-0 px-8 md:px-6 2xl:px-20 flex items-center md:items-center justify-center md:justify-start h-full">
                  <div className="w-full md:max-w-3xl md:mx-30">
                    <div
                      className="relative rounded-lg md:rounded-2xl bg-[rgba(0,0,0,0.24)] px-4 py-6 md:px-8 md:py-11"
                      style={{
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "gray",
                      }}
                    >
                      {slide.title && (
                        <h1 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-4 leading-tight">
                          {slide.title}
                        </h1>
                      )}
                      {slide.description && (
                        <p className="text-xs md:text-lg text-white mb-3 md:mb-6 leading-relaxed">
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && slide.buttonLink && (
                        <div className="flex justify-center md:justify-end">
                          <Link
                            href={slide.buttonLink}
                            className="inline-block px-4 md:px-8 py-2 md:py-3 bg-[#F6BA40] backdrop-blur-sm text-black text-xs md:text-sm font-semibold rounded-full hover:bg-white/30 transition-all hover:text-black"
                          >
                            {slide.buttonText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className="swiper-button-prev-custom absolute left-1 md:left-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Previous slide"
      >
        <Image
          src="/assets/images/HeroSection/leftIconek.svg"
          alt="Previous"
          width={60}
          height={60}
          className="w-6 h-6 md:w-16 md:h-16"
        />
      </button>

      <button
        className="swiper-button-next-custom absolute right-1 md:right-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Next slide"
      >
        <Image
          src="/assets/images/HeroSection/righticonek.svg"
          alt="Next"
          width={60}
          height={60}
          className="w-6 h-6 md:w-16 md:h-16"
        />
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2"></div>
    </section>
  );
}