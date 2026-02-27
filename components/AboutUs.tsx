"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTranslation } from "@/lib/i18n";

interface Feature {
  id: number;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: "/assets/images/about/a_1.svg",
    titleKey: "aboutUs.features.constructionManagement.title",
    descriptionKey: "aboutUs.features.constructionManagement.description",
  },
  {
    id: 2,
    icon: "/assets/images/about/a_2.svg",
    titleKey: "aboutUs.features.bestMaterials.title",
    descriptionKey: "aboutUs.features.bestMaterials.description",
  },
  {
    id: 3,
    icon: "/assets/images/about/a_3.svg",
    titleKey: "aboutUs.features.professionalStandards.title",
    descriptionKey: "aboutUs.features.professionalStandards.description",
  },
];

export default function AboutUs() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);

    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem("language") || "en";
      setLanguage(newLanguage);
    };

    window.addEventListener("storage", handleLanguageChange);
    return () => window.removeEventListener("storage", handleLanguageChange);
  }, []);

  return (
    <section className="w-full bg-linear-to-r to-[#F0F3FF] from-[#FFFFFF] dark:from-[#000000] dark:to-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-[36px] font-bold text-brand-primary dark:text-white tracking-tight mb-6 transition-colors">
            {getTranslation(language, "aboutUs.heading")}
          </h2>
          <p className="text-base text-brand-primary dark:text-gray-300 max-w-5xl mx-auto leading-relaxed transition-colors">
            {getTranslation(language, "aboutUs.description")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature) => (
            <Link href="/about" key={feature.id}>
              <div className="relative cursor-pointer h-full">
                {/* Icon positioned at top center, overlapping card */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-10">
                  <Image
                    src={feature.icon}
                    alt={getTranslation(language, feature.titleKey)}
                    width={140}
                    height={140}
                    className="w-[100px] h-[100px]"
                  />
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#000000] rounded-[10px] border-gray-300 dark:border-gray-700 pt-28 pb-10 px-10 flex flex-col items-center text-center hover:shadow-lg transition-all border h-full min-h-[380px]">
                  {/* Title */}
                  <h3 className="text-[24px] font-bold text-brand-primary dark:text-white mb-6 leading-tight transition-colors">
                    {getTranslation(language, feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-[15px] text-[#64748B] dark:text-gray-400 leading-relaxed transition-colors">
                    {getTranslation(language, feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
