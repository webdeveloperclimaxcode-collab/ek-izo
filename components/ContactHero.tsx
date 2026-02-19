"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Office {
  image: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  url: string;
}

interface DropdownSection {
  id: number;
  title: string;
  offices?: Office[];
}

interface CompanyInfo {
  phone?: string;
  email?: string;
  address?: string;
}

const sections: DropdownSection[] = [
  {
    id: 1,
    title: "Offices",
    offices: [
      {
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
        phone: "+355696666060",
        fax: "+355 69 66 66 060",
        email: "Info@izogrup.Al",
        url: "izogrup.Al/COM",
      },
      {
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
        phone: "+355696666060",
        fax: "+355 69 66 66 060",
        email: "Info@izogrup.Al",
        url: "izogrup.Al/COM",
      },
    ],
  },
  {
    id: 2,
    title: "Plants",
  },
  {
    id: 3,
    title: "Distribution Centers",
  },
  {
    id: 4,
    title: "Headquarters",
  },
];

export default function ContactHero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const sections: DropdownSection[] = [
    {
      id: 1,
      title: t("contactPage.offices"),
      offices: [
        {
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
          address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
          phone: "+355696666060",
          fax: "+355 69 66 66 060",
          email: "Info@izogrup.Al",
          url: "izogrup.Al/COM",
        },
        {
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
          phone: "+355696666060",
          fax: "+355 69 66 66 060",
          email: "Info@izogrup.Al",
          url: "izogrup.Al/COM",
        },
      ],
    },
    {
      id: 2,
      title: t("contactPage.plants"),
    },
    {
      id: 3,
      title: t("contactPage.distributionCenters"),
    },
    {
      id: 4,
      title: t("contactPage.headquarters"),
    },
  ];

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("/api/company-info");
      const data = await response.json();
      if (data.success) {
        setCompanyInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/contact/hero.png"
            alt="Contacts"
            fill
            className={`object-cover ${theme === "dark" ? "brightness-50" : ""}`}
            priority
          />
          {/* Dark Overlay */}
          <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`}></div>
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-white text-[48px] font-bold">
          {t("contactPage.contactsHero")}
        </h1>
      </section>

      {/* Content Section */}
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-5xl mx-auto">
          {/* Company Title */}
          <h2 className={`text-[32px] font-bold text-center mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
            {t("contactPage.companyTitle")}
          </h2>

          {/* Description */}
          <div className="text-center mb-8">
            <p className={`text-[15px] leading-relaxed mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1b2556]"}`}>
              {t("contactPage.description1")}
            </p>
            <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1b2556]"}`}>
              {t("contactPage.description2")}
            </p>

            {/* Dynamic Company Contact Info */}
            {companyInfo && (
              <div className="mt-6 space-y-2">
                {companyInfo.phone && (
                  <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                    {t("contactPage.phone")}: {companyInfo.phone}
                  </p>
                )}
                {companyInfo.email && (
                  <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                    {t("contactPage.email")}: <Link href={`mailto:${companyInfo.email}`} className={`hover:underline transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-[#1b2556]"}`}>{companyInfo.email}</Link>
                  </p>
                )}
                {companyInfo.address && (
                  <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1b2556]"}`}>
                    {companyInfo.address}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contact Button */}
          <div className="flex justify-center mb-12">
            <Link
              href="/support"
              className="px-10 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px]"
            >
              {t("contactPage.contactButton")}
            </Link>
          </div>

          {/* Dropdown Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="border-l-4 border-[#9F001B]">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-colors duration-300 ${theme === "dark"
                      ? "bg-[#000000] hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-50 text-[#4A5568]"
                      }`}
                  >
                    <span className="text-[18px] font-semibold">
                      {section.title}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                        } ${openSection === section.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                {openSection === section.id && section.offices && (
                  <div className={`py-6 space-y-8 ml-1 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
                    {section.offices.map((office, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-6">
                        {/* Office Image */}
                        <div className="relative w-full md:w-[420px] h-[420px] flex-shrink-0">
                          <Image
                            src={office.image}
                            alt={`Office ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Office Details */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
                              {t("contactPage.officeAddress")}
                            </h4>
                            <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                              {office.address}
                            </p>
                          </div>

                          <div>
                            <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
                              {t("contactPage.officePhone")}
                            </h4>
                            <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                              {office.phone}
                            </p>
                          </div>

                          <div>
                            <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
                              {t("contactPage.officeFax")}
                            </h4>
                            <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                              {office.fax}
                            </p>
                          </div>

                          <div>
                            <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
                              {t("contactPage.officeEmail")}
                            </h4>
                            <Link
                              href={`mailto:${office.email}`}
                              className={`text-[14px] hover:underline transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-[#3B82F6]"}`}
                            >
                              {office.email}
                            </Link>
                          </div>

                          <div>
                            <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
                              {t("contactPage.officeUrl")}
                            </h4>
                            <Link
                              href={`https://${office.url}`}
                              target="_blank"
                              className={`text-[14px] hover:underline transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-[#9F001B]"}`}
                            >
                              {office.url}
                            </Link>
                          </div>

                          {/* Google Maps Button */}
                          <div className="pt-2">
                            <Link
                              href="https://maps.google.com"
                              target="_blank"
                              className="inline-block px-8 py-3 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[14px]"
                            >
                              {t("contactPage.findOnMaps")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
