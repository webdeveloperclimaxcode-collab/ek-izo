"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface CalculateConsumptionProps {
  productName?: string;
  serviceName?: string;
}

export default function CalculateConsumption({ productName, serviceName }: CalculateConsumptionProps) {
  const [tileLength, setTileLength] = useState("");
  const [tileWidth, setTileWidth] = useState("");
  const [tileThickness, setTileThickness] = useState("");
  const [areaToCover, setAreaToCover] = useState("");
  const [groutLength, setGroutLength] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleReset = () => {
    setTileLength("");
    setTileWidth("");
    setTileThickness("");
    setAreaToCover("");
    setGroutLength("");
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (!tileLength || !tileWidth || !tileThickness || !areaToCover || !groutLength) {
      setError(t("productsPage.fillAllFields"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/consumption-calculation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          serviceName,
          tileLength,
          tileWidth,
          tileThickness,
          areaToCover,
          groutLength,
          userEmail: user?.email,
          userName: user?.displayName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(t("productsPage.calculationError"));
      }
    } catch (err) {
      console.error("Error submitting calculation:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`calculate-consumption-section w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className={`text-[30px] font-bold text-center mb-12 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
          {t("productsPage.calculateConsumption")}
        </h2>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-600 text-sm">{t("productsPage.calculationSuccess")}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Tile Specifications */}
        <div className="mb-10">
          <h3 className={`text-[15px] font-semibold mb-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
            {t("productsPage.tileSpecifications")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input
              type="text"
              placeholder={t("productsPage.tileLengthMm")}
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value)}
              className={`px-7 py-4 rounded-2xl focus:outline-none focus:ring-1 text-[14px] shadow-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-gray-600"
                  : "bg-white text-[#4A5568] placeholder:text-[#C7CCD1] focus:ring-gray-300"
                }`}
            />
            <input
              type="text"
              placeholder={t("productsPage.tileWidthMm")}
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              className={`px-7 py-4 rounded-2xl focus:outline-none focus:ring-1 text-[14px] shadow-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-gray-600"
                  : "bg-white text-[#4A5568] placeholder:text-[#C7CCD1] focus:ring-gray-300"
                }`}
            />
            <input
              type="text"
              placeholder={t("productsPage.tileThicknessMm")}
              value={tileThickness}
              onChange={(e) => setTileThickness(e.target.value)}
              className={`px-7 py-4 rounded-2xl focus:outline-none focus:ring-1 text-[14px] shadow-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-gray-600"
                  : "bg-white text-[#4A5568] placeholder:text-[#C7CCD1] focus:ring-gray-300"
                }`}
            />
          </div>
        </div>

        {/* Area and Grout Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Area To Be Covered */}
          <div>
            <h3 className={`text-[15px] font-semibold mb-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
              {t("productsPage.areaToBeCovered")}
            </h3>
            <input
              type="text"
              placeholder={t("productsPage.areaM2")}
              value={areaToCover}
              onChange={(e) => setAreaToCover(e.target.value)}
              className={`w-full px-7 py-4 rounded-2xl focus:outline-none focus:ring-1 text-[14px] mb-4 shadow-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-gray-600"
                  : "bg-white text-[#4A5568] placeholder:text-[#C7CCD1] focus:ring-gray-300"
                }`}
            />
            <p className={`text-[12px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
              {t("productsPage.recommendedWidth")}
            </p>
          </div>

          {/* Grout Specifications */}
          <div>
            <h3 className={`text-[15px] font-semibold mb-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#4A5568]"}`}>
              {t("productsPage.groutSpecifications")}
            </h3>
            <input
              type="text"
              placeholder={t("productsPage.tileLengthGrout")}
              value={groutLength}
              onChange={(e) => setGroutLength(e.target.value)}
              className={`w-full px-7 py-4 rounded-2xl focus:outline-none focus:ring-1 text-[14px] shadow-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-gray-600"
                  : "bg-white text-[#4A5568] placeholder:text-[#C7CCD1] focus:ring-[#3B82F6]"
                }`}
            />
          </div>
        </div>

        {/* Login Message and Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          {/* <p className="text-[13px] text-[#6B7280]">
            {t("productsPage.loginMessage")}
          </p> */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className={`px-10 py-3 font-semibold rounded-full transition-colors text-[14px] ${theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-[#E8EAED] text-brand-primary hover:bg-[#DDE0E4]"
                }`}
            >
              {t("productsPage.reset")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 font-semibold rounded-full transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-brand-gradient text-white hover:opacity-90"
            >
              {loading ? t("productsPage.sending") : t("productsPage.submit")}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`text-[12px] leading-relaxed space-y-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
          <p>
            {t("productsPage.disclaimer1")}
          </p>
          <p>
            {t("productsPage.disclaimer2")}
          </p>
        </div>
      </div>
    </section>
  );
}
