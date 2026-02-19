"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    id: 1,
    icon: "/assets/images/about/rightchoice.svg",
    title: "RIGHT CHOICE",
    description:
      "Izogrup is the right choice, offering comprehensive services, the right tools, and a skilled team all with cost-efficient solutions.",
  },
  {
    id: 2,
    icon: "/assets/images/about/saving.svg",
    title: "SAVING TIME",
    description:
      "Izogrup operates nationwide in Albania and maintains fully stocked warehouses, eliminating the need for third-party sourcing.",
  },
  {
    id: 3,
    icon: "/assets/images/about/minimal.svg",
    title: "MINIMAL COST",
    description:
      "With local materials, staff, and equipment in your city, we deliver projects efficiently and at highly competitive prices.",
  },
];

export default function WhyChooseUs() {
  const { theme } = useTheme();

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="relative flex flex-col min-h-[320px]">
              {/* Icon positioned at top center, overlapping card */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-14 z-10">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  width={120}
                  height={120}
                  className="w-28 h-28"
                />
              </div>

              {/* Card - same height, border in both modes (Figma) */}
              <div className={`flex-1 flex flex-col rounded-2xl pt-20 pb-10 px-8 items-center text-center border transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-[#1a1a1a] border-gray-600"
                  : "bg-white border-gray-200"
              }`}>
                {/* Title */}
                <h3 className={`text-[20px] font-bold mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className={`text-[14px] leading-relaxed transition-colors duration-300 flex-1 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
