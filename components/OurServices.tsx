"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  images: string[];
  enableOnlineSales: boolean;
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, service: Service) => {
    e.preventDefault();
    if (service.price && service.enableOnlineSales) {
      addToCart({
        id: service.id,
        title: service.title,
        price: service.price,
        image: service.images[0] || "/assets/images/ourproduts/p1.png",
        type: "service",
      });
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-[#F5F7FA] dark:bg-[#000000] py-20 transition-colors duration-300">
        <div className="w-full px-6 2xl:px-24 text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white dark:bg-black py-14 transition-colors duration-300">
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-left mb-10">
          <h2 className="relative inline-block text-[26px] md:text-[30px] font-bold text-[#111827] dark:text-white tracking-tight transition-colors mb-4 pb-2">
            {/* The Text - z-10 ensures it sits ON TOP of the color */}
            <span className="relative z-10">
              {t("ourServices.heading")}
            </span>

            {/* The Highlight - absolute positioning places it behind */}
            <div className="absolute left-0 bottom-1 w-full h-7 bg-brand-secondary z-0" />
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6B7280] dark:text-gray-300 max-w-3xl leading-relaxed transition-colors">
            {t("ourServices.description")}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="bg-white dark:bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative h-[170px] md:h-[185px] bg-gray-100 dark:bg-gray-900">
                {service.images && service.images.length > 0 ? (
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="text-[12px] md:text-[13px] font-semibold uppercase tracking-wide text-[#111827] dark:text-white leading-snug line-clamp-2 min-h-[34px]">
                  {service.title}
                </h3>
                <p className="text-[12px] md:text-[13px] text-[#6B7280] dark:text-gray-300 leading-relaxed line-clamp-2 min-h-[38px]">
                  {service.description || ""}
                </p>

                {/* PRICE AND ADD TO CART */}
                {/* {service.price && (
                  <div className="flex justify-between items-center mt-auto">
                    <div className="bg-[#FFF5F7] dark:bg-[#1a1a1a] px-9 py-4 rounded-[38px] shadow-sm transition-colors">
                      <span className="text-2xl font-bold text-brand-secondary dark:text-white transition-colors">
                        ${service.price}
                      </span>
                    </div>
                    {service.enableOnlineSales && (
                      <button
                        onClick={(e) => handleAddToCart(e, service)}
                        className=" cursor-pointer "
                        title="Add to cart"
                      >
                        <Image
                          src="/assets/images/Products_page/cart.svg"
                          alt="Add to cart"
                          width={52}
                          height={52}
                          className="w-[52px] h-[52px]"
                        />
                      </button>
                    )}
                  </div>
                )} */}
              </div>
            </Link>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-10">
          <Link
            href="/services"
            className="px-10 py-3 rounded-full border border-brand-secondary text-[#373737] bg-white font-semibold text-[12px] tracking-wide shadow-sm hover:bg-brand-secondary/5 transition"
          >
            {t("ourServices.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
