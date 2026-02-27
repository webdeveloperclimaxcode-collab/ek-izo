"use client";

import Image from "next/image";
import { useTranslation } from "@/app/lib/hooks/useTranslation";

interface Stat {
  id: number;
  icon: string;
  titleKey: string;
  subtitleKey: string;
}

const stats: Stat[] = [
  {
    id: 1,
    icon: "/assets/images/whychoose/c_1.svg",
    titleKey: "whyChoose.stats.experience.title",
    subtitleKey: "whyChoose.stats.experience.subtitle",
  },
  {
    id: 2,
    icon: "/assets/images/whychoose/c_2.svg",
    titleKey: "whyChoose.stats.projects.title",
    subtitleKey: "whyChoose.stats.projects.subtitle",
  },
  {
    id: 3,
    icon: "/assets/images/whychoose/c_3.svg",
    titleKey: "whyChoose.stats.clients.title",
    subtitleKey: "whyChoose.stats.clients.subtitle",
  },
  {
    id: 4,
    icon: "/assets/images/whychoose/c_4.svg",
    titleKey: "whyChoose.stats.environment.title",
    subtitleKey: "whyChoose.stats.environment.subtitle",
  },
  // {
  //   id: 5,
  //   icon: "/assets/images/whychoose/c5.svg",
  //   titleKey: "whyChoose.stats.quality.title",
  //   subtitleKey: "whyChoose.stats.quality.subtitle",
  // },
];

export default function WhyChoose() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-linear-to-r to-[#FFFFFF] from-[#F0F3FF] dark:from-[#000000] dark:to-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-[32px] font-bold text-brand-primary dark:text-white tracking-tight mb-4 transition-colors">
            {t("whyChoose.heading")}
          </h2>
          <p className="text-base text-brand-primary dark:text-white max-w-5xl mx-auto leading-relaxed transition-colors">
            {t("whyChoose.description")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-3">
                <Image
                  src={stat.icon}
                  alt={t(stat.titleKey)}
                  width={70}
                  height={70}
                  className="w-[70px] h-[70px]"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-brand-primary dark:text-white leading-tight uppercase transition-colors">
                {t(stat.titleKey)}
              </h3>

              {/* Subtitle */}
              <p className="text-sm font-bold text-brand-primary dark:text-white leading-tight uppercase transition-colors">
                {t(stat.subtitleKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
