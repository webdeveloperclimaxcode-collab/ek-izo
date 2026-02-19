"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
interface Document {
  title: string;
  url: string;
}

interface DocumentsData {
  files: Document[];
  currency?: string;
}

interface Product {
  documents: DocumentsData | null;
}

export default function RelatedDocuments({ productId }: { productId: string }) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error("Error fetching product documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, title: string) => {
    // Use proxy API to download the file
    const filename = title.endsWith('.pdf') ? title : `${title}.pdf`;
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !product || !product.documents) {
    return null;
  }

  const documents = product.documents.files || [];

  if (documents.length === 0) {
    return null;
  }

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className={`text-[32px] font-bold text-center mb-10 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
          {t("productsPage.relatedDocuments")}
        </h2>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 flex items-center justify-between transition-colors duration-300 ${theme === "dark"
                ? "bg-[#000000]"
                : "bg-[#F5F7FA]"
                }`}
            >
              {/* Left Side - Icon and Title */}
              <div className="flex items-center gap-4">
                <Image
                  src={theme === "dark" ? "/assets/images/Products_page/docment_white.svg" : "/assets/images/Products_page/docment.svg"}
                  alt="Document"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <h3 className={`text-[18px] font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                  {doc.title}
                </h3>
              </div>

              {/* Right Side - Download */}
              <div className="flex items-center gap-4">
                <span className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors duration-300 ${theme === "dark"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-[#E8EAED] text-[#1B2556]"
                  }`}>
                  {t("productsPage.english")}
                </span>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(doc.url, doc.title)}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label={t("productsPage.download")}
                >
                  <Image
                    src={theme === "dark" ? "/assets/images/Products_page/download_white.svg" : "/assets/images/Products_page/download.svg"}
                    alt="Download"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
