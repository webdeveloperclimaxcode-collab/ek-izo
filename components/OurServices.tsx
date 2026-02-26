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
    <section className="w-full bg-linear-to-r from-[#F0F3FF] to-[#FFFFFF] dark:from-[#000000] dark:to-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-bold text-brand-primary dark:text-white mb-3 tracking-tight transition-colors">
            {t("ourServices.heading")}
          </h2>
          <p className="text-[18px] text-[#4A5568] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors">
            {t("ourServices.description")}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-[#000000] rounded-[26px] shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.3)] overflow-hidden hover:shadow-xl dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-shadow flex flex-col border border-gray-200 dark:border-gray-700 group"
            >
              {/* IMAGES */}
              {service.images.length === 1 ? (
                /* SINGLE IMAGE */
                <div className="relative h-[240px]">
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="rounded-[20px] object-cover"
                  />
                </div>
              ) : service.images.length > 1 ? (
                /* 4-GRID COLLAGE */
                <div className="grid grid-cols-2 gap-2">
                  {service.images.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className={`relative ${index < 2 ? "h-[135px]" : "h-[100px]"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* NO IMAGE */
                <div className="relative h-[260px] p-3 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* CONTENT */}
              <div className="px-6 pb-6 pt-3 flex flex-col flex-1">
                <Link href={`/services/${service.id}`}>
              <h3 className="text-[17px] font-bold text-brand-secondary dark:text-white mb-3 leading-tight uppercase min-h-[50px] hover:underline transition-colors">
                    {service.title}
                  </h3>
                </Link>

                <p className="text-[15px] text-brand-primary dark:text-white mb-5 leading-relaxed line-clamp-2 min-h-[48px] transition-colors">
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
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center">
          <Link
            href="/services"
            className="px-14 py-4 rounded-full bg-brand-gradient text-white font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            {t("ourServices.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
