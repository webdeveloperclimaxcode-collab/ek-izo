"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/app/lib/hooks/useTranslation";
import { useTheme } from "@/contexts/ThemeContext";

export default function CostOfServices() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full  px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        <div className={`bg-linear-to-r rounded-[20px] sm:rounded-[32px] px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border transition-colors duration-300 ${theme === "dark"
          ? "from-[#1E3A5F] to-[#2D1B4E] border-[#3A4A6F]"
          : "from-[#E8EEFF] to-[#F5F7FF] border-[#E2E8F0]"
          }`}>
          {/* Left Side - Icon and Text */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            {/* Icon */}
            <div className="shrink-0">
              <Image
                src="/assets/images/services/request_Icon.svg"
                alt={t("costOfServices.heading")}
                width={100}
                height={100}
                className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px]"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className={`text-[20px] sm:text-[24px] lg:text-[28px] font-bold mb-2 tracking-wide transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"
                }`}>
                {t("costOfServices.heading")}
              </h3>
              <p className={`text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"
                }`}>
                {t("costOfServices.description")}
              </p>
            </div>
          </div>

          {/* Right Side - Button */}
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/support"
              className="block text-center md:inline-block px-8 sm:px-12 lg:px-16 py-4 sm:py-5 bg-brand-gradient text-white font-bold rounded-full hover:opacity-90 transition-opacity text-[15px] sm:text-[16px] lg:text-[18px] tracking-wider"
            >
              {t("costOfServices.requestQuote")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
