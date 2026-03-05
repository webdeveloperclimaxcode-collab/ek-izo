"use client";

import Image from "next/image";

interface Stat {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
}

const stats: Stat[] = [
  {
    id: 1,
    icon: "/assets/images/about/inbox.svg", // black icon (yellow stroke)
    title: "10+ Years",
    subtitle: "Of Experience",
  },
  {
    id: 2,
    icon: "/assets/images/about/stars.svg",
    title: "110+",
    subtitle: "Projects",
  },
  {
    id: 3,
    icon: "/assets/images/about/star.svg",
    title: "100+",
    subtitle: "Happy Clients",
  },
  {
    id: 4,
    icon: "/assets/images/about/plant_leaves.svg",
    title: "We Protect",
    subtitle: "Environment",
  },
  {
    id: 5,
    icon: "/assets/images/about/guard.svg",
    title: "Economy &",
    subtitle: "Quality",
  },
];

export default function WhyChooseStats() {
  return (
    <section className="w-full bg-gradient-to-r from-[#2b2b2b] to-[#1f1f1f] py-20">
      <div className="w-full mx-auto px-6 2xl:px-20">

        {/* Heading */}
        <div className="mb-14">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-wide">
            WHY CHOOSE EK GROUP
          </h2>
          <p className="text-gray-300 text-lg mt-3">
            The advantages of partnering with us
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#f0b43a] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[330px] transition-transform duration-300 hover:scale-105"
            >
              {/* Icon box */}
              <div className="bg-[#1f1f1f] rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
                <Image
                  src={stat.icon}
                  alt={stat.title}
                  width={80}
                  height={80}
                // className="w-10 h-10"
                />
              </div>

              {/* Text */}
              <h3 className="text-[#1f1f1f] text-xl font-semibold leading-tight">
                {stat.title}
              </h3>
              {stat.subtitle && (
                <p className="text-[#1f1f1f] text-xl font-semibold leading-tight">
                  {stat.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}