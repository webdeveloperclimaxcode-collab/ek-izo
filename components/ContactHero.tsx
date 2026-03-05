// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTheme } from "@/contexts/ThemeContext";

// interface Office {
//   image: string;
//   address: string;
//   phone: string;
//   fax: string;
//   email: string;
//   url: string;
// }

// interface DropdownSection {
//   id: number;
//   title: string;
//   offices?: Office[];
// }

// interface CompanyInfo {
//   phone?: string;
//   email?: string;
//   address?: string;
// }

// const sections: DropdownSection[] = [
//   {
//     id: 1,
//     title: "Offices",
//     offices: [
//       {
//         image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
//         address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
//         phone: "+355696666060",
//         fax: "+355 69 66 66 060",
//         email: "Info@ekgrup.Al",
//         url: "ekgrup.Al/COM",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
//         address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
//         phone: "+355696666060",
//         fax: "+355 69 66 66 060",
//         email: "Info@ekgrup.Al",
//         url: "ekgrup.Al/COM",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Plants",
//   },
//   {
//     id: 3,
//     title: "Distribution Centers",
//   },
//   {
//     id: 4,
//     title: "Headquarters",
//   },
// ];

// export default function ContactHero() {
//   const { t } = useLanguage();
//   const { theme } = useTheme();
//   const [openSection, setOpenSection] = useState<number | null>(null);
//   const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

//   const sections: DropdownSection[] = [
//     {
//       id: 1,
//       title: t("contactPage.offices"),
//       offices: [
//         {
//           image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
//           address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
//           phone: "+355696666060",
//           fax: "+355 69 66 66 060",
//           email: "Info@ekgrup.Al",
//           url: "ekgrup.Al/COM",
//         },
//         {
//           image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
//           address: "Rruga Cerrik Gostimë, Gostimë 3018, Albania",
//           phone: "+355696666060",
//           fax: "+355 69 66 66 060",
//           email: "Info@ekgrup.Al",
//           url: "ekgrup.Al/COM",
//         },
//       ],
//     },
//     {
//       id: 2,
//       title: t("contactPage.plants"),
//     },
//     {
//       id: 3,
//       title: t("contactPage.distributionCenters"),
//     },
//     {
//       id: 4,
//       title: t("contactPage.headquarters"),
//     },
//   ];

//   useEffect(() => {
//     fetchCompanyInfo();
//   }, []);

//   const fetchCompanyInfo = async () => {
//     try {
//       const response = await fetch("/api/company-info");
//       const data = await response.json();
//       if (data.success) {
//         setCompanyInfo(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching company info:", error);
//     }
//   };

//   const toggleSection = (id: number) => {
//     setOpenSection(openSection === id ? null : id);
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative w-full h-[500px] flex items-center justify-center">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/assets/images/contact/hero_2_ek.png"
//             alt="Contacts"
//             fill
//             sizes="100vw"
//             quality={100}
//             className={`object-cover object-center ${theme === "dark" ? "brightness-50" : ""}`}
//             priority
//           />
//           {/* Dark Overlay */}
//           {/* <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`}></div> */}
//         </div>

//         {/* Title */}
//         <h1 className="relative z-10 text-black text-[48px] font-semibold">
//           {t("contactPage.contactsHero")}
//         </h1>
//       </section>

//       {/* Content Section */}
//       <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
//         <div className="w-full px-6 2xl:px-20 max-w-5xl mx-auto">
//           {/* Company Title */}
//           <h2 className={`text-[32px] font-bold text-center mb-6 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//             {t("contactPage.companyTitle")}
//           </h2>

//           {/* Description */}
//           <div className="text-center mb-8">
//             <p className={`text-[15px] leading-relaxed mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//               {t("contactPage.description1")}
//             </p>
//             <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//               {t("contactPage.description2")}
//             </p>

//             {/* Dynamic Company Contact Info */}
//             {companyInfo && (
//               <div className="mt-6 space-y-2">
//                 {companyInfo.phone && (
//                   <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//                     {t("contactPage.phone")}: {companyInfo.phone}
//                   </p>
//                 )}
//                 {companyInfo.email && (
//                   <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//                     {t("contactPage.email")}: <Link href={`mailto:${companyInfo.email}`} className={`hover:underline transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-brand-primary"}`}>{companyInfo.email}</Link>
//                   </p>
//                 )}
//                 {companyInfo.address && (
//                   <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
//                     {companyInfo.address}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Contact Button */}
//           <div className="flex justify-center mb-12">
//             <Link
//               href="/support"
//               className="px-10 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[15px]"
//             >
//               {t("contactPage.contactButton")}
//             </Link>
//           </div>

//           {/* Dropdown Sections */}
//           <div className="space-y-4">
//             {sections.map((section) => (
//               <div key={section.id}>
//                 <div className="border-l-4 border-brand-secondary">
//                   <button
//                     onClick={() => toggleSection(section.id)}
//                     className={`w-full flex items-center justify-between px-6 py-4 transition-colors duration-300 ${theme === "dark"
//                       ? "bg-[#000000] hover:bg-gray-700 text-white"
//                       : "bg-white hover:bg-gray-50 text-[#4A5568]"
//                       }`}
//                   >
//                     <span className="text-[18px] font-semibold">
//                       {section.title}
//                     </span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${theme === "dark" ? "text-gray-500" : "text-gray-400"
//                         } ${openSection === section.id ? "rotate-180" : ""}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 {openSection === section.id && section.offices && (
//                   <div className={`py-6 space-y-8 ml-1 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
//                     {section.offices.map((office, index) => (
//                       <div key={index} className="flex flex-col md:flex-row gap-6">
//                         {/* Office Image */}
//                         <div className="relative w-full md:w-[420px] h-[420px] flex-shrink-0">
//                           <Image
//                             src={office.image}
//                             alt={`Office ${index + 1}`}
//                             fill
//                             className="object-cover rounded-lg"
//                           />
//                         </div>

//                         {/* Office Details */}
//                         <div className="flex-1 space-y-4">
//                           <div>
//                             <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
//                               {t("contactPage.officeAddress")}
//                             </h4>
//                             <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
//                               {office.address}
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
//                               {t("contactPage.officePhone")}
//                             </h4>
//                             <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
//                               {office.phone}
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
//                               {t("contactPage.officeFax")}
//                             </h4>
//                             <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
//                               {office.fax}
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
//                               {t("contactPage.officeEmail")}
//                             </h4>
//                             <Link
//                               href={`mailto:${office.email}`}
//                               className={`text-[14px] hover:underline transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-[#3B82F6]"}`}
//                             >
//                               {office.email}
//                             </Link>
//                           </div>

//                           <div>
//                             <h4 className={`text-[14px] font-semibold mb-1 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
//                               {t("contactPage.officeUrl")}
//                             </h4>
//                             <Link
//                               href={`https://${office.url}`}
//                               target="_blank"
//                               className={`text-[14px] hover:underline transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-[#9F001B]"}`}
//                             >
//                               {office.url}
//                             </Link>
//                           </div>

//                           {/* Google Maps Button */}
//                           <div className="pt-2">
//                             <Link
//                               href="https://maps.google.com"
//                               target="_blank"
//                               className="inline-block px-8 py-3 bg-brand-gradient text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[14px]"
//                             >
//                               {t("contactPage.findOnMaps")}
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


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

export default function ContactHero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [openSection, setOpenSection] = useState<number | null>(1); // Default to 1 to match the open state in the image
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const sections: DropdownSection[] = [
    {
      id: 1,
      title: t("contactPage.offices") || "Offices",
      offices: [
        {
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
          address: "Rruga Cerrik Gostime, Gostimë 3018, Albania",
          phone: "+355696666060",
          fax: "+355 69 66 66 060",
          email: "Info@ekgrup.Al",
          url: "Ek Group.COM",
        },
        {
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          address: "Rruga Cerrik Gostime, Gostimë 3018, Albania",
          phone: "+355696666060",
          fax: "+355 69 66 66 060",
          email: "Info@ekgrup.Al",
          url: "Ek Group.COM",
        },
      ],
    }
    // {
    //   id: 2,
    //   title: t("contactPage.plants") || "Plants",
    // },
    // {
    //   id: 3,
    //   title: t("contactPage.distributionCenters") || "Distribution Centers",
    // },
    // {
    //   id: 4,
    //   title: t("contactPage.headquarters") || "Headquarters",
    // },
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
      <section className="relative w-full h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/contact/hero_2_ek.png"
            alt="Contacts"
            fill
            sizes="100vw"
            quality={100}
            className={`object-cover object-center ${theme === "dark" ? "brightness-50" : ""}`}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-black text-[48px] font-semibold">
          {t("contactPage.contactsHero")}
        </h1>
      </section>

      {/* Content Section */}
      <section className={`max-w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#F5F5F5]"}`}>
        <div className="w-full px-6 2xl:px-20  mx-auto">
          <div className="w-full mb-10   mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left Image */}
              <div className="relative w-full lg:w-1/3 h-[400px] lg:h-[480px] flex-shrink-0">
                <Image
                  src="/assets/images/about/our_background.png"
                  alt="EK Group Contacts"
                  fill
                  quality={100}
                  className="object-cover rounded-3xl"
                  priority
                />
              </div>

              {/* Right Content */}
              <div className="w-full  flex  flex-col justify-center space-y-6">
                <h2 className={`text-[40px] font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1A1A1A]"}`}>
                  {t("contactPage.companyTitle")}
                </h2>

                <div className="space-y-6">
                  <p className={`text-[15px] lg:text-2xl leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}>
                    {t("contactPage.description1")}
                  </p>
                  <p className={`text-[15px] lg:text-2xl leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}>
                    {t("contactPage.description2")}
                  </p>

                  {/* Dynamic Company Contact Info */}
                  {/* {companyInfo && (
                    <div className="mt-6 space-y-2">
                      {companyInfo.phone && (
                        <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1A1A1A]"}`}>
                          {t("contactPage.phone")}: {companyInfo.phone}
                        </p>
                      )}
                      {companyInfo.email && (
                        <p className={`text-[15px] font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1A1A1A]"}`}>
                          {t("contactPage.email")}: <Link href={`mailto:${companyInfo.email}`} className={`hover:underline transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-brand-primary"}`}>{companyInfo.email}</Link>
                        </p>
                      )}
                      {companyInfo.address && (
                        <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1A1A1A]"}`}>
                          {companyInfo.address}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>

                {/* Contact Button */}
                <div className="pt-4">
                  <Link
                    href="/support"
                    className={`inline-block lg:text-2xl px-8 py-3.5 border rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${theme === "dark"
                      ? "border-[#EAB308] text-white hover:bg-[#EAB308] hover:text-black"
                      : "border-[#EAB308] text-[#1A1A1A] hover:bg-gray-50"
                      }`}
                  >
                    {t("contactPage.contactButton") || "CONTACT THE TECHNICAL & COMMERCIAL SUPPORT"}
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Dropdown Sections (Updated strictly to match the layout in the image) */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`rounded-lg overflow-hidden transition-all duration-300 `}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full rounded-xl mb-4 flex items-center justify-between px-6 py-5 transition-colors duration-300 bg-white ${theme === "dark"
                    ? "hover:bg-gray-800 text-white"
                    : "hover:bg-gray-50 text-[#4A5568]"
                    }`}
                >
                  <span className="text-[16px] font-semibold">
                    {section.title}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                      } ${openSection === section.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0s 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openSection === section.id && section.offices && (
                  <div className="px-6 pb-8 space-y-12 lg:pt-10 bg-gray-100">
                    {section.offices.map((office, index) => (
                      <div
                        key={index}
                        // Alternate row direction based on index (even = image left, odd = image right)
                        className={`flex flex-col gap-8 md:gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row '
                          }`}
                      >
                        {/* Office Image */}
                        <div className="relative w-full md:w-[380px] h-[380px] flex-shrink-0">
                          <Image
                            src={office.image}
                            alt={`Office ${index + 1}`}
                            fill
                            className="object-cover rounded-2xl shadow-sm"
                          />
                        </div>

                        {/* Office Details */}
                        <div className="flex-1 flex flex-col justify-center space-y-6 w-full">
                          <div className="space-y-5">
                            {/* Address */}
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              </div>
                              <div className="pt-0.5">
                                <h4 className={`text-[13px] font-bold leading-none ${theme === "dark" ? "text-gray-200" : "text-[#1A1A1A]"}`}>
                                  Address
                                </h4>
                                <p className={`text-[14px] mt-1.5 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                                  {office.address}
                                </p>
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                              </div>
                              <div className="pt-0.5">
                                <h4 className={`text-[13px] font-bold leading-none ${theme === "dark" ? "text-gray-200" : "text-[#1A1A1A]"}`}>
                                  Phone
                                </h4>
                                <p className={`text-[14px] mt-1.5 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                                  {office.phone}
                                </p>
                              </div>
                            </div>

                            {/* Fax */}
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                              </div>
                              <div className="pt-0.5">
                                <h4 className={`text-[13px] font-bold leading-none ${theme === "dark" ? "text-gray-200" : "text-[#1A1A1A]"}`}>
                                  Fax
                                </h4>
                                <p className={`text-[14px] mt-1.5 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                                  {office.fax}
                                </p>
                              </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                              </div>
                              <div className="pt-0.5">
                                <h4 className={`text-[13px] font-bold leading-none ${theme === "dark" ? "text-gray-200" : "text-[#1A1A1A]"}`}>
                                  Email
                                </h4>
                                <Link
                                  href={`mailto:${office.email}`}
                                  className={`text-[14px] mt-1.5 block underline hover:opacity-80 transition-opacity ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}
                                >
                                  {office.email}
                                </Link>
                              </div>
                            </div>

                            {/* URL */}
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                              </div>
                              <div className="pt-0.5">
                                <h4 className={`text-[13px] font-bold leading-none ${theme === "dark" ? "text-gray-200" : "text-[#1A1A1A]"}`}>
                                  URL
                                </h4>
                                <Link
                                  href={`https://${office.url}`}
                                  target="_blank"
                                  className="text-[14px] mt-1.5 block font-medium text-[#EAB308] hover:underline transition-colors"
                                >
                                  {office.url}
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Google Maps Button */}
                          <div className="pt-4">
                            <Link
                              href="https://maps.google.com"
                              target="_blank"
                              className={`inline-block px-6 py-2.5 border rounded-full text-[12px] font-bold transition-colors ${theme === "dark"
                                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                : "border-gray-300 text-[#4A5568] hover:bg-gray-50"
                                }`}
                            >
                              FIND US ON GOOGLE MAPS
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