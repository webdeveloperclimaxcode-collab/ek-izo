"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface CompanyInfo {
  companyCV?: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "/assets/images/header/englishFlg.png" },
  { code: "sq", name: "Albanian", flag: "/assets/images/header/alibania.png" },
  { code: "it", name: "Italian", flag: "/assets/images/header/itlian.png" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Initialize language from context
  useEffect(() => {
    const lang = languages.find(l => l.code === language) || languages[0];
    setSelectedLanguage(lang);
  }, [language]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
    // Initialize translation function
    const initTranslations = async () => {
      const { getTranslation } = await import('@/lib/i18n');
      setT(() => (key: string) => getTranslation(language, key));
    };
    initTranslations();
  }, [language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }

      if (
        isLanguageOpen &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isLanguageOpen]);

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

  const navItems = [
    { name: t("header.home"), href: "/" },
    // { name: t("header.products"), href: "/products" },
    { name: t("header.services"), href: "/services" },
    // { name: t("header.search"), href: "/search" },
    { name: t("header.projects"), href: "/projects" },
    { name: t("header.contact"), href: "/contact" },
  ];

  return (
    <header className="w-full py-3 relative bg-white dark:bg-[#000000] transition-colors duration-300">
      <div className="w-full mx-auto px-6 2xl:px-20">
        <div className="flex items-center justify-between gap-2 min-h-16 py-2">
          {/* Logo */}
          <div className="shrink-0 min-w-0">
            <Link href="/">
              <Image
                src="/assets/images/header/logo_bg_remove.png"
                alt="IZOGRUP Logo"
                width={200}
                height={45}
                className="h-aut0 w-auto max-w-[150px] lg:max-w-[200px]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-center flex-1 min-w-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 xl:px-6 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-brand-gradient text-white rounded-full hover:opacity-90"
                      : "text-brand-primary dark:text-white hover:text-[#7D1F3E] dark:hover:text-brand-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Language Selector, Cart & Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart Icon */}
            {/* <button
              onClick={openCart}
              className="relative cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                className="w-6 h-6 text-brand-primary dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute cursor-pointer -top-1 -right-1 bg-brand-gradient text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button> */}

            {/* Language Dropdown */}
            <div ref={languageRef} className="relative hidden lg:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex cursor-pointer items-center gap-2 px-3 xl:px-6 py-3 xl:py-4 bg-[#F5F5F5] dark:bg-gray-700 rounded-full text-base font-medium text-[#2D3748] dark:text-white hover:bg-[#E8E8E8] dark:hover:bg-gray-600 transition-colors"
              >
                <Image
                  src={selectedLanguage.flag}
                  alt={selectedLanguage.name}
                  width={32}
                  height={20}
                  className="w-5 xl:w-6 object-cover rounded shrink-0"
                />
                <span className="text-[13px] xl:text-[15px] whitespace-nowrap hidden xl:inline">{selectedLanguage.name}</span>
                <Image
                  src="/assets/images/header/dropdown.svg"
                  alt="Dropdown"
                  width={15}
                  height={15}
                  className="w-3 xl:w-4 shrink-0 dark:invert"
                />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F5F5F5] dark:bg-gray-700 rounded-2xl shadow-xl py-2 z-50">
                  {languages
                    .filter((lang) => lang.code !== selectedLanguage.code)
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setSelectedLanguage(lang);
                          setIsLanguageOpen(false);
                        }}
                        className="w-full px-5 py-3 text-left cursor-pointer text-base text-[#2D3748] dark:text-white hover:bg-white dark:hover:bg-gray-600 flex items-center gap-3 transition-colors rounded-xl"
                      >
                        <Image
                          src={lang.flag}
                          alt={lang.name}
                          width={32}
                          height={20}
                          className="w-8 h-5 rounded"
                        />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 cursor-pointer px-2 xl:px-3 py-2 text-sm font-medium text-[#4A5568] dark:text-gray-300 hover:text-[#7D1F3E] dark:hover:text-brand-secondary transition-colors"
            >
              <span className="text-[16px] xl:text-[18px] text-[#1b2556] dark:text-white whitespace-nowrap">Menu</span>
              <Image
                src="/assets/images/header/Menu_Icon.svg"
                alt="Menu"
                width={50}
                height={50}
                className="w-7 xl:w-8 shrink-0 dark:brightness-0 dark:invert"
              />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="header-dropdown-menu absolute top-full right-6 w-80 bg-white dark:bg-[#000000] rounded-b-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-300">
            <div className="p-6">
              {/* Search bar and Close button - same row, aligned */}
              <div className="flex items-right gap-2 mb-6">
                {/* <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                      setIsMenuOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  className="flex-1 min-w-0 relative"
                >
                  <input
                    type="text"
                    placeholder={t("header.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="header-dropdown-search-input w-full px-6 py-3 bg-brand-gradient text-white placeholder:text-white placeholder:opacity-100 rounded-full focus:outline-none text-[14px]"
                  />
                  <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer">
                    <Image
                      src="/assets/images/header/search_icon.svg"
                      alt=""
                      width={18}
                      height={18}
                      className="w-4 h-4 dark:invert"
                    />
                  </button>
                </form> */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-shrink-0 item-right p-1 hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/closeicon_white.svg" : "/assets/images/header/closeicon.svg"}
                    alt="Close"
                    width={24}
                    height={24}
                    className="w-6 h-6 dark:invert"
                  />
                </button>
              </div>

              {/* User Profile / Login */}
              {user ? (
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center">
                        <span className="text-white text-[18px] font-bold">
                          {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-bold text-brand-primary dark:text-white truncate">
                        {user.displayName || "User"}
                      </h3>
                      <p className="text-[12px] text-[#6B7280] dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-[14px] font-semibold">{t("header.logout")}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Image
                    src="/assets/images/header/dropdown_logo.svg"
                    alt="MyIzogrup"
                    width={50}
                    height={50}
                    className="w-12 h-12 dark:invert"
                  />
                  <div>
                    <h3 className="text-[16px] font-bold text-brand-primary dark:text-white">
                      {t("header.myIzogrup")}
                    </h3>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[13px] text-[#6B7280] dark:text-gray-400 hover:text-brand-secondary dark:hover:text-[#ff4d6d] cursor-pointer"
                    >
                      {t("header.login")}
                    </Link>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-1">
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/about_icon_white.svg" : "/assets/images/header/about_icon.svg"}
                    alt="About"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.aboutUs")}
                  </span>
                </Link>

                {/* <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/product_white.svg" : "/assets/images/header/product.svg"}
                    alt="Products"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-[#1B2556] dark:text-white">{t("header.products")}</span>
                </Link> */}

                <Link
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/services_white.svg" : "/assets/images/header/services.svg"}
                    alt="Services"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.services")}
                  </span>
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/projects_white.svg" : "/assets/images/header/projects.svg"}
                    alt="Projects"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.projects")}
                  </span>
                </Link>

                <a
                  href={companyInfo?.companyCV || "https://www.izogrup.al/produkte/cvizogrup.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/compnaycv_white.svg" : "/assets/images/header/compnaycv.svg"}
                    alt="Company CV"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.companyCv")}
                  </span>
                </a>

                <Link
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/newsblog_white.svg" : "/assets/images/header/newsblog.svg"}
                    alt="News & Blog"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.newsAndBlog")}
                  </span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/header/contact_white.svg" : "/assets/images/header/contact.svg"}
                    alt="Contact"
                    width={22}
                    height={22}
                    className="w-5 h-5"
                  />
                  <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                    {t("header.contactUs")}
                  </span>
                </Link>

                <button
                  onClick={toggleTheme}
                  className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <svg className="w-5 h-5 text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                        {t("header.darkMode")}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-[15px] text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary">
                        {t("header.lightMode")}
                      </span>
                    </>
                  )}
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}