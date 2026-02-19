"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProjectsHero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedApplication, setSelectedApplication] = useState("Application");
  const [selectedProducts, setSelectedProducts] = useState("Products");
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showApplicationDropdown, setShowApplicationDropdown] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCategorySection, setShowCategorySection] = useState(true);

  const categories = [
    "COMMERCIAL FACILITIES",
    "Infrastructures",
    "Production & Services",
    "Residential Building",
    "Public Building & Places",
    "Sports Facilities",
    "Tourism & Wellness",
    "Special Projects",
  ];

  const applications = ["All Applications", "Waterproofing", "Insulation", "Soundproofing"];
  const products = ["All Products", "TPO/PVC", "Bitumen", "Liquid Membranes"];
  const countries = ["All Countries", "Albania", "Italy", "Greece"];

  return (
    <section className="relative w-full">
      {/* Hero Image */}
      <div className="relative w-full h-[300px]">
        <Image
          src="/assets/images/projects/hero.png"
          alt="Projects"
          fill
          className={`object-cover ${theme === "dark" ? "brightness-50" : ""}`}
          priority
        />
        {/* Dark Overlay */}
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`}></div>

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white text-[36px] md:text-[42px] font-bold text-center leading-tight">
            {t("projectsPage.projectsHero")}
          </h1>
        </div>
      </div>
    </section>
  );
}
