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
    icon: "/assets/images/about/like.svg",
    title: "RIGHT CHOICE",
    description:
      "Ekgrup is the right choice, offering comprehensive services, the right tools, and a skilled team all with cost-efficient solutions.",
  },
  {
    id: 2,
    icon: "/assets/images/about/clock.svg",
    title: "SAVING TIME",
    description:
      "Ekgrup operates nationwide in Albania and maintains fully stocked warehouses, eliminating the need for third-party sourcing.",
  },
  {
    id: 3,
    icon: "/assets/images/about/money.svg",
    title: "MINIMAL COST",
    description:
      "With local materials, staff, and equipment in your city, we deliver projects efficiently and at highly competitive prices.",
  },
];

export default function WhyChooseUs() {
  const { theme } = useTheme();

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 2xl:px-20  mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="h-[430px]">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-8 text-left h-full">
                {/* Icon */}
                <div className="mb-12">
                  {/* <div className="w-12 h-12  rounded-lg flex items-center justify-center"> */}
                  <Image
                    src={benefit.icon}
                    alt={benefit.title}
                    width={80}
                    height={80}
                  // className="w-6 h-6"
                  />
                  {/* </div> */}
                </div>

                {/* Title */}
                <h3 className="text-[18px] lg:text-3xl font-medium text-gray-800 dark:text-white mb-4 leading-tight transition-colors">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] lg:text-2xl leading-tight text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
}
