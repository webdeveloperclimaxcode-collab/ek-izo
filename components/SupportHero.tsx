"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function SupportHero() {
  const { theme } = useTheme();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] flex flex-col items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/contact/hero.png"
            alt="Technical & Commercial Support"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-white text-[42px] font-bold mb-3">
            TECHNICAL & COMMERCIAL SUPPORT
          </h1>
          <p className="text-white text-[18px]">
            Always on hand for our clients, both before and after selling a
            product.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-5xl mx-auto">
          {/* Title */}
          <h2 className={`text-[32px] text-center mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
            Our{" "}
            <span className={`font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
              Technical Assistance Service
            </span>{" "}
            For Professionals
          </h2>

          {/* Description */}
          <p className={`text-[15px] leading-relaxed text-center mb-10 max-w-4xl mx-auto transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
            <span className="text-brand-secondary font-semibold">IZOGRUP</span>{" "}
            delivers global technical and installation support through our highly
            skilled specialists, experienced across every sector. Our experts
            provide guidance on the correct use of{" "}
            <span className="text-brand-secondary font-semibold">IZOGRUP</span>{" "}
            products and are always available to assist with any technical
            inquiries.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              href="#contact-form"
              className="px-10 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px] min-w-[280px] text-center"
            >
              CONTACT US ONLINE
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px] min-w-[280px] text-center"
            >
              CONSULT AGENTS FROM YOUR AREA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
