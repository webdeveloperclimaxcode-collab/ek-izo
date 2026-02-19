"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCategory {
  id: string;
  name: string;
}

interface CompanyInfo {
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
}

export default function Footer() {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProductCategories();
    fetchCompanyInfo();

    // Handle scroll event
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const response = await fetch("/api/product-categories?limit=24");
      const data = await response.json();
      if (data.success) {
        setProductCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

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
  return (
    <>
      {/* Contact Us Banner - always same look (no dark mode) */}
      <div className="w-full text-white py-8 mb-8 bg-linear-to-r from-[#9F001B] to-[#1B2556]">
        <div className="w-full px-6 2xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">{t("footer.contactBanner.heading")}</h2>
            <p className="text-lg opacity-90 text-white/90">{t("footer.contactBanner.subheading")}</p>
          </div>
          <Link
            href="/support"
            className="px-8 cursor-pointer py-3 rounded-full font-semibold bg-white text-[#9F001B] hover:bg-gray-100 transition-colors"
          >
            {t("footer.contactBanner.button")}
          </Link>
        </div>
      </div>

      <footer className="relative w-full text-white overflow-hidden bg-gray-900">
        {/* Background Image - always visible */}
        <div className="absolute inset-0 opacity-100">
          <Image
            src="/assets/images/Footer/bg_img_1.5.png"
            alt="Footer Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative w-full px-6 2xl:px-20 py-16">
          {/* Logo - Full Width */}
          <div className="mb-12">
            <Image
              src="/assets/images/Footer/footerLogo.svg"
              alt="IZOGRUP Logo"
              width={220}
              height={60}
              className="h-14 w-auto brightness-0 invert"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Section - Social Media, App Downloads, Contact, Login */}
            <div className="lg:col-span-5 space-y-8">
              {/* Follow Us */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">{t("footer.followUs")}</h3>
                <div className="flex gap-4">
                  {companyInfo?.facebookUrl && (
                    <Link href={companyInfo.facebookUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/fb.svg"
                        alt="Facebook"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </Link>
                  )}
                  {companyInfo?.instagramUrl && (
                    <Link href={companyInfo.instagramUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/insta.svg"
                        alt="Instagram"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </Link>
                  )}
                  {companyInfo?.youtubeUrl && (
                    <Link href={companyInfo.youtubeUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/yt.svg"
                        alt="YouTube"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </Link>
                  )}
                  {companyInfo?.tiktokUrl && (
                    <Link href={companyInfo.tiktokUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/whatsap.svg"
                        alt="TikTok"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </Link>
                  )}
                  {companyInfo?.linkedinUrl && (
                    <Link href={companyInfo.linkedinUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/linkden.svg"
                        alt="LinkedIn"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </Link>
                  )}
                </div>
              </div>

              {/* Download Our App */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">{t("footer.downloadApp")}</h3>
                <div className="flex gap-4">
                  {companyInfo?.appStoreUrl && (
                    <Link href={companyInfo.appStoreUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/apple.svg"
                        alt="Download on App Store"
                        width={140}
                        height={45}
                        className="h-11 w-auto"
                      />
                    </Link>
                  )}
                  {companyInfo?.googlePlayUrl && (
                    <Link href={companyInfo.googlePlayUrl} target="_blank" className="hover:opacity-80 transition-opacity cursor-pointer">
                      <Image
                        src="/assets/images/Footer/google.svg"
                        alt="Get it on Google Play"
                        width={140}
                        height={45}
                        className="h-11 w-auto"
                      />
                    </Link>
                  )}
                </div>
              </div>

              {/* Contact Us */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">{t("footer.contactInfo")}</h3>
                <div className="space-y-2 text-base text-white">
                  {companyInfo?.phone && <p>Call Us {companyInfo.phone}</p>}
                  {companyInfo?.email && <p>{companyInfo.email}</p>}
                  {companyInfo?.address && <p className="text-sm">{companyInfo.address}</p>}
                </div>
              </div>

              {/* Login Register / Logout */}
              {user ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{t("footer.account")}</h3>
                  <div className="space-y-3">
                    <p className="text-white text-sm">
                      {t("footer.loggedInAs")} <span className="font-semibold">{user.displayName || user.email}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors cursor-pointer text-sm"
                    >
                      {t("footer.logout")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{t("footer.loginRegister")}</h3>
                  <Link href="/login" className="inline-block hover:opacity-80 transition-opacity cursor-pointer">
                    <Image
                      src="/assets/images/Footer/smalLogo.svg"
                      alt="MyIZOGRUP Login"
                      width={180}
                      height={60}
                      className="h-auto w-auto"
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Section - Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                {/* Column 1 */}
                <div className="space-y-8">
                  <Link href="/products" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/20 cursor-pointer">
                    {t("footer.products")}
                  </Link>

                  <Link href="/search" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/20 cursor-pointer">
                    {t("footer.sustainability")}
                  </Link>
                  <Link href="/search" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/20 cursor-pointer">
                    {t("footer.toolsDownloads")}
                  </Link>
                  <Link href="/support" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/20 cursor-pointer">
                    {t("footer.technicalService")}
                  </Link>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                  <Link href="/projects" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/30 cursor-pointer">
                    {t("footer.projects")}
                  </Link>
                  <Link href="/about" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/30 cursor-pointer">
                    {t("footer.aboutUs")}
                  </Link>
                  <Link href="/blog" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/30 cursor-pointer">
                    {t("footer.news")}
                  </Link>

                  <Link href="/contact" className="block text-base font-medium text-white hover:text-gray-200 transition-colors pb-3 border-b border-white/30 cursor-pointer">
                    {t("footer.contactUs")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Product Lines (always same, no dark mode) */}
        <div className="relative bg-linear-to-r from-[#9F001B] via-[#58143B] to-[#1B2556]">
          <div className="w-full px-6 2xl:px-20 py-8">
            <h3 className="text-xl font-bold mb-6 text-white">{t("footer.productLines")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-3">
              {productCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="text-sm text-white hover:text-gray-200 transition-colors uppercase cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll to Top Button - Fixed/Sticky positioned */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed cursor-pointer bottom-8 right-8 z-50 hover:opacity-80 transition-all duration-300 hover:scale-110"
            aria-label={t("footer.scrollToTop")}
          >
            <Image
              src="/assets/images/Footer/UpArrow.svg"
              alt="Scroll to top"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </button>
        )}

        {/* Copyright / Bottom Footer (always same, no dark mode) */}
        <div className="relative bg-linear-to-r from-[#9F001B] to-[#1B2556]">
          <div className="w-full px-6 2xl:px-20 py-4">
            <p className="text-sm text-white">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
