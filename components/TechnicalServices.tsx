"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface Service {
  id: number;
  icon: string;
  title: string;
}

const services: Service[] = [
  {
    id: 1,
    icon: "/assets/images/contact/reomte_ek.svg",
    title: "Remote",
  },
  {
    id: 2,
    icon: "/assets/images/contact/onsite_ek.svg",
    title: "On-Site",
  },
  {
    id: 3,
    icon: "/assets/images/contact/team_ek.svg",
    title: "Dedicated Team",
  },
];

export default function TechnicalServices() {
  const { theme } = useTheme();

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#F4F4F4]"}`}>
      <div className="w-full text-brand-primary px-6 2xl:px-20  mx-auto">
        {/* Description */}
        <p className={`text-[15px] leading-relaxed text-center mb-12 lg:text-2xl text-justify mx-auto transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-brand-primary"}`}>
          <span className="text-[#F6BA40] font-semibold">EKGRUP's</span> highly
          qualified{" "}
          <span className={`font-bold ${theme === "dark" ? "text-white" : ""}`}>
            Technical Services Division
          </span>{" "}
          provides reliable{" "}
          <span className={`font-bold ${theme === "dark" ? "text-white" : ""}`}>support</span> at every
          stage from design to installation and on-site operations ensuring
          results that fully meet your expectations. With expert teams positioned
          worldwide, we offer prompt assistance and are always ready to respond
          quickly to client needs.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 2xl:px-30">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col bg-white dark:bg-black dark:border-[#F6BA40] py-25 gap-10 rounded-lg border border-[#E0E0E0] items-center text-center"
            >
              {/* Icon */}
              <div className="mb-6">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={100}
                  height={100}
                  className="w-24 h-24"
                />
              </div>

              {/* Title */}
              <h3 className={`text-[20px] lg:text-4xl font-medium transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
