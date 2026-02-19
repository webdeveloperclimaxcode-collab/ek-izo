"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Service {
  videos: string[];
}

export default function ServiceVideos({ serviceId }: { serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${serviceId}`);
      const data = await response.json();
      if (data.success) {
        setService(data.data);
      }
    } catch (error) {
      console.error("Error fetching service videos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !service || !service.videos || service.videos.length === 0) {
    return null;
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "/assets/images/services/s1.png";
  };

  const mainVideo = service.videos[0];
  const relatedVideos = service.videos.slice(1, 4);

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
      <div className="w-full px-6 2xl:px-20 max-w-7xl mx-auto">
        {/* Main Video */}
        <div className="relative w-full h-[450px] rounded-2xl overflow-hidden mb-8 shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(mainVideo)}
            title="Service Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* Copy Link Button */}
          <button
            onClick={() => navigator.clipboard.writeText(mainVideo)}
            className={`absolute top-4 right-4 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-md ${theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-white text-[#2D3748] hover:bg-gray-50"
              }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {t("productsPage.copyLink")}
          </button>
        </div>

        {/* Related Videos Grid */}
        {relatedVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVideos.map((videoUrl, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${theme === "dark"
                    ? "bg-gray-800"
                    : "bg-white"
                  }`}
                onClick={() => window.open(videoUrl, '_blank')}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Video Thumbnail */}
                  <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden group">
                    <Image
                      src={getYouTubeThumbnail(videoUrl)}
                      alt={`Video ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1">
                    <h3 className={`text-[15px] font-bold mb-1.5 leading-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                      {t("productsPage.relatedVideo")} {index + 1}
                    </h3>
                    <p className={`text-[12px] leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#9CA3AF]"}`}>
                      {t("productsPage.clickToWatch")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
