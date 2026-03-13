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
      "Ek-grup has been building trust across Europe for over a decade. We bring together experienced professionals, quality materials, and proven project management to deliver results that stand the test of time. When you partner with us, you're choosing a team that genuinely cares about getting the job done right.",
  },
  {
    id: 2,
    icon: "/assets/images/about/clock.svg",
    title: "SAVING TIME",
    description:
      "We've got warehouses stocked and crews ready throughout Europe, so we don't waste time waiting for materials or shuffling teams around. That means your project moves forward without unnecessary delays, and you get to see real progress week after week.",
  },
  {
    id: 3,
    icon: "/assets/images/about/money.svg",
    title: "MINIMAL COST",
    description:
      "Because we work locally with trusted suppliers and our own experienced crew, we cut out the middleman and unnecessary expenses. You're paying for quality and efficiency not hidden fees which is how we keep our prices competitive without cutting corners.",
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
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-8 text-left h-full overflow-hidden flex flex-col">
                {/* Icon */}
                <div className="mb-12">
                  <Image
                    src={benefit.icon}
                    alt={benefit.title}
                    width={80}
                    height={80}
                  />
                </div>

                {/* Title */}
                <h3 className="text-[18px] lg:text-3xl font-medium text-gray-800 dark:text-white mb-4 leading-tight transition-colors">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] lg:text-lg leading-relaxed text-gray-600 dark:text-gray-400 transition-colors flex-1 overflow-y-auto">
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
