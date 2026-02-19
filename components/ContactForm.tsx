"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function ContactForm() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    surname: "",
    city: "",
    province: "",
    agree: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send email via API
      const response = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          surname: formData.surname || undefined,
          city: formData.city || undefined,
          province: formData.province || undefined,
          subject: "Contact Form Submission",
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          surname: "",
          city: "",
          province: "",
          agree: false,
        });

        // Show success message
        setShowSuccess(true);

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setError(t("contactPage.failedToSend"));
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setError(t("contactPage.errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-4xl mx-auto">
        {/* Title */}
        <h2 className={`text-[32px] text-center mb-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}>
          {t("contactPage.askForAdvice")} <span className={`font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>{t("contactPage.technicalAdvice")}</span>
        </h2>

        {/* Subtitle */}
        <p className={`text-[15px] text-center mb-10 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
          {t("contactPage.fillForm")}
        </p>

        {/* Success Message Popup */}
        {showSuccess && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-2xl">
            <div className={`p-6 border-2 rounded-2xl text-center shadow-2xl transition-colors ${theme === "dark" ? "bg-gray-800" : "bg-white"}`} style={{ borderColor: "#9F001B" }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg
                  className="w-8 h-8 text-[#9F001B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <h3 className={`text-xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                  {t("contactPage.messageSentSuccess")}
                </h3>
              </div>
              <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#4A5568]"}`}>
                {t("contactPage.thankYouMessage")}
              </p>
            </div>
          </div>
        )}

        {/* Error Message Popup */}
        {error && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-2xl">
            <div className={`p-6 border-2 border-red-500 rounded-2xl text-center shadow-2xl transition-colors ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <h3 className="text-xl font-bold text-red-600">
                  {t("contactPage.error")}
                </h3>
              </div>
              <p className="text-red-600 text-[15px]">{error}</p>
            </div>
          </div>
        )}

        {/* Form - white placeholders in dark mode (Ask For Technical Advice) */}
        <form onSubmit={handleSubmit} className="contact-form-technical-advice">
          {/* Name and Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder={t("contactPage.namePlaceholder")}
              value={formData.name}
              onChange={handleChange}
              required
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
            <input
              type="text"
              name="surname"
              placeholder={t("contactPage.surnamePlaceholder")}
              value={formData.surname}
              onChange={handleChange}
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="email"
              name="email"
              placeholder={t("contactPage.emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("contactPage.phonePlaceholder")}
              value={formData.phone}
              onChange={handleChange}
              required
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
          </div>

          {/* City and Province */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="city"
              placeholder={t("contactPage.cityPlaceholder")}
              value={formData.city}
              onChange={handleChange}
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
            <input
              type="text"
              name="province"
              placeholder={t("contactPage.provincePlaceholder")}
              value={formData.province}
              onChange={handleChange}
              className={`px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] shadow-sm transition-colors ${theme === "dark"
                ? "bg-gray-800 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
                : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
                }`}
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder={t("contactPage.messagePlaceholder")}
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className={`w-full px-6 py-4 rounded-xl focus:outline-none focus:ring-2 text-[15px] mb-8 shadow-sm resize-none transition-colors ${theme === "dark"
              ? "bg-gray-700 text-white placeholder:text-white placeholder:opacity-100 focus:ring-[#ff4d6d]"
              : "bg-white text-[#4A5568] placeholder:text-[#9CA3AF] focus:ring-[#3B82F6]"
              }`}
          ></textarea>

          {/* Privacy Policy */}
          <div className="mb-8">
            <h3 className={`text-[18px] font-bold mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              {t("contactPage.processingInfo")}
            </h3>
            <p className={`text-[14px] mb-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
              {t("contactPage.privacyText")}
            </p>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className={`mt-1 w-5 h-5 border-2 rounded focus:ring-2 transition-colors ${theme === "dark"
                  ? "border-gray-600 bg-gray-700 focus:ring-[#ff4d6d]"
                  : "border-gray-300 bg-white focus:ring-[#3B82F6]"
                  }`}
              />
              <span className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{t("contactPage.iAgree")}</span>
            </label>
            <p className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
              {t("contactPage.consentText")}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-16 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[16px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t("contactPage.sending") : t("contactPage.contactUs")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
