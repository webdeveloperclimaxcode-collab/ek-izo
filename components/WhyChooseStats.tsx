"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface Stat {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
}

const stats: Stat[] = [
  {
    id: 1,
    icon: "/assets/images/about/handicon.svg",
    title: "15+ Years On",
    subtitle: "The National Market",
  },
  {
    id: 2,
    icon: "/assets/images/about/projectcompleticon.svg",
    title: "300+ Completed",
    subtitle: "Projects",
  },
  {
    id: 3,
    icon: "/assets/images/about/skilledicon.svg",
    title: "100+ Skilled",
    subtitle: "Professionals",
  },
];

export default function WhyChooseStats() {
  const { theme } = useTheme();

  return (
    <section className="relative w-full h-[400px] flex items-center justify-center mb-16">
      {/* Background Image - same in dark and light mode (no extra filter/overlay in dark) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/about/whychosebg.png"
          alt="Why Choose Us Background"
          fill
          className="object-cover"
        />
        {/* Overlay - same in both themes */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 2xl:px-20 max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-white text-[36px] font-bold text-center mb-12">
          Why CHOOSE US
        </h2>

        {/* Stats Container */}
        <div className={`backdrop-blur-md rounded-3xl border p-8 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white/10 border-white/20"
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Image
                    src={stat.icon}
                    alt={stat.title}
                    width={80}
                    height={80}
                    className="w-20 h-20"
                  />
                </div>

                {/* Title */}
                <h3 className="text-white text-[20px] font-bold leading-tight">
                  {stat.title}
                </h3>

                {/* Subtitle */}
                <p className="text-white text-[20px] font-bold leading-tight">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
