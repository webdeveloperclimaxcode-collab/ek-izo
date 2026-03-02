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
              src="/assets/images/about/our_background.png"
              alt="Izogrup Logo"
              width={400}
              height={200}
              className="w-full max-w-md"
            />
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className={`text-[32px] font-bold mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
              OUR BACKGROUND
            </h2>
            <p className={`text-[16px] leading-relaxed mb-8 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
            EKGRUP 2010 by Eduart Kumrija is a construction company based in Cërrik, Elbasan, founded in 2010 after several years of professional experience in Italy (2004–2010). We specialize in building construction, plastering, structural works, and technical finishing services.
With a trained and qualified team of 15 professionals, we are committed to quality, precision, safety, and timely project completion. Our company operates with modern equipment and advanced construction technology to ensure high standards in every project.
Our mission is to deliver reliable, high-quality construction services while maintaining strong client relationships built on trust and professionalism.
            </p>
            <Link
              href="/services"
              className="inline-block px-10 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px]"
            >
              SEE OUR SERVICES
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
