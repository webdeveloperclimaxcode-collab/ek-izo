"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
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
    <section className="w-full bg-white dark:bg-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-start mb-16">
          <div className="flex justify-start mb-2">
            <div className="relative inline-block ">
              {/* <h2 className="text-[36px] font-bold text-brand-primary dark:text-white tracking-tight transition-colors">
                ABOUT US
              </h2>
              
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div> */}
              <h2 className="relative inline-block text-[26px] md:text-[30px] font-bold text-[#111827] dark:text-white tracking-tight transition-colors  pb-2">
                {/* The Text - z-10 ensures it sits ON TOP of the color */}
                <span className="relative z-10">
                  {t("aboutUs.heading")}
                </span>

                {/* The Highlight - absolute positioning places it behind */}
                <div className="absolute left-0 bottom-1 w-full h-7 bg-brand-secondary z-0" />
              </h2>
            </div>
          </div>
          <div className="flex justify-start">
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-4xl leading-relaxed transition-colors text-start">
              We provide waterproofing and thermal insulation for all types of buildings—from homes and small businesses to large corporations. Our trained team delivers professional installations with a strong focus on quality and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((feature) => (
            <Link href="/about" key={feature.id}>
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-8 text-left h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={feature.icon}
                      alt={getTranslation(language, feature.titleKey)}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-gray-800 dark:text-white mb-4 leading-tight transition-colors">
                  {getTranslation(language, feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                  {getTranslation(language, feature.descriptionKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
