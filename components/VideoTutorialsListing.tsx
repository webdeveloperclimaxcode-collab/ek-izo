"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Spinner from "./Spinner";
import { getVideoEmbedUrl, getVideoThumbnailUrl } from "@/lib/video";

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
}

export default function VideoTutorialsListing() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [visibleVideos, setVisibleVideos] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/videos");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data);
        setFilteredVideos(data.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredVideos(videos);
      setVisibleVideos(6);
      return;
    }

    const nextVideos = videos.filter((video) => {
      const title = video.title.toLowerCase();
      const description = (video.description || "").toLowerCase();
      return title.includes(query) || description.includes(query);
    });

    setFilteredVideos(nextVideos);
    setVisibleVideos(6);
  }, [debouncedSearchQuery, videos]);

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const loadMore = () => {
    setVisibleVideos((prev) => prev + 6);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="relative w-full h-[430px] flex items-end justify-center">
        <div className={`absolute inset-0 z-0 h-[300px] ${theme === "dark" ? "brightness-50" : ""}`}>
          <Image
            src="/assets/images/blog/hero.jpg"
            alt="Video Tutorials Background"
            fill
            className="object-cover"
            priority
          />
          <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/40"}`}></div>
          <div className="absolute inset-0 flex items-center  justify-center">
            <h1 className="text-white text-[30px] lg:text-[60px]  font-medium">VIDEO TUTORIAL</h1>
          </div>
        </div>

        <div className="relative w-full">
          <div className="py-10 transition-colors duration-300 bg-[#292929]">
            <div className="w-full px-6 2xl:px-20 mx-auto">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-3.5 text-black rounded-full focus:outline-none text-[15px] transition-colors duration-300 bg-brand-secondary placeholder:text-black! placeholder:opacity-100!"
                  />
                  <button
                    type="submit"
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    aria-label="Search"
                  >
                    <Image
                      src="/assets/images/Products_page/search_icon.svg"
                      alt="Search"
                      width={18}
                      height={18}
                      className="w-4 h-4 cursor-pointer hover:opacity-80"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 2xl:px-20 max-w-full mx-auto">
          <div className="mb-8 text-center">
            <h2 className={`text-[28px] lg:text-[40px] font-medium tracking-wider mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
              {t("videoTutorial.heading")}
            </h2>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {filteredVideos.length > 0 ? (
                  filteredVideos.slice(0, visibleVideos).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => openVideoModal(video)}
                      className={`rounded-lg overflow-hidden hover:shadow-lg cursor-pointer group transition-all border ${theme === "dark"
                        ? "bg-[#1a1a1a] border-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative h-[200px] overflow-hidden">
                        <Image
                          src={getVideoThumbnailUrl(video.youtubeUrl)}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-6">
                        <h3 className={`text-[18px] lg:text-[22px] font-medium mb-3 leading-tight line-clamp-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                          {video.title}
                        </h3>
                        <p className={`text-[14px] lg:text-xl leading-relaxed line-clamp-3 transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {video.description }
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className={`text-lg transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      No videos found.
                    </p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {filteredVideos.length > visibleVideos && (
                <div className="flex justify-center mt-10">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="px-12 py-4 border border-[#F6BA40]  text-black font-semibold rounded-full hover:opacity-90 transition-opacity text-base"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className={`relative w-full max-w-5xl rounded-lg overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              <svg
                className={`w-6 h-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video Player */}
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getVideoEmbedUrl(selectedVideo.youtubeUrl, true)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                {selectedVideo.title}
              </h3>
              {selectedVideo.description && (
                <p className={`transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
