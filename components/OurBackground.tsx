"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function OurBackground() {
  const { theme } = useTheme();

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark"
      ? "bg-[#000000]"
      : "bg-linear-to-r from-[#F0F3FF] to-[#FFFFFF]"
      }`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/assets/images/about/about-logo.svg"
              alt="Izogrup Logo"
              width={400}
              height={200}
              className="w-full max-w-md"
            />
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className={`text-[32px] font-bold mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              OUR BACKGROUND
            </h2>
            <p className={`text-[16px] leading-relaxed mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1b2556]"}`}>
              Founded in 2004 by Oligert and Erion Plaka, Izogrup has become one
              of Albania's leading providers of waterproofing and thermal
              insulation solutions. With a strong focus on quality and technical
              expertise, we deliver reliable, durable systems that set industry
              standards and ensure long-lasting protection.
            </p>
            <Link
              href="/services"
              className="inline-block px-10 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px]"
            >
              SEE OUR SERVICES
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
