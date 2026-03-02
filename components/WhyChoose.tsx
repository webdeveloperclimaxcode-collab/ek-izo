"use client";

import Image from "next/image";

interface Stat {
  id: number;
  icon: string;
  titleKey: string;
  subtitleKey: string;
}

const getStatTitle = (index: number): string => {
  const titles = [
    "10+ Years",
    "110+",
    "100+",
    "We Protect",
    "Economy &"
  ];
  return titles[index] || "";
};

const getStatSubtitle = (index: number): string => {
  const subtitles = [
    "Of Experience",
    "Projects",
    "Happy Clients",
    "Environment",
    "Quality"
  ];
  return subtitles[index] || "";
};

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
  {
    id: 5,
    icon: "/assets/images/whychoose/c5.svg",
    titleKey: "whyChoose.stats.quality.title",
    subtitleKey: "whyChoose.stats.quality.subtitle",
  },
];

export default function WhyChoose() {
  return (
    <section className="w-full bg-gray-50 dark:bg-[#000000] py-16 transition-colors duration-300">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h2 className="text-[36px] font-bold text-brand-primary dark:text-white tracking-tight transition-colors">
              WHY CHOOSE EK GROUP
            </h2>
            {/* Yellow underline */}
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed transition-colors">
            The advantages of partnering with us
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all p-6 text-center h-full relative"
            >
              {/* Icon positioned at top center inside card */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={stat.icon}
                    alt={getStatTitle(index)}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3 className="text-[18px] font-bold text-gray-800 dark:text-white leading-tight transition-colors">
                  {getStatTitle(index)}
                </h3>
                <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-tight transition-colors">
                  {getStatSubtitle(index)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
