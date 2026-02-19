"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Spinner from "./Spinner";

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
}

export default function VideoTutorialsListing() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

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
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "/assets/images/services/s1.png";
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-[42px] font-bold mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              VIDEO TUTORIALS
            </h1>
            <p className={`text-[16px] max-w-3xl mx-auto transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
              Watch our comprehensive video tutorials to learn more about our products and services
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => openVideoModal(video)}
                      className={`border rounded-lg overflow-hidden hover:shadow-lg cursor-pointer group transition-all duration-300 ${theme === "dark"
                        ? "bg-[#000000] border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative h-56">
                        <Image
                          src={getYouTubeThumbnail(video.youtubeUrl)}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg
                              className="w-10 h-10 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-5">
                        <h3 className={`text-[18px] font-bold mb-2 line-clamp-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className={`text-[14px] line-clamp-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"}`}>
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className={`text-lg transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>No videos available</p>
                  </div>
                )}
              </div>
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
                src={getYouTubeEmbedUrl(selectedVideo.youtubeUrl)}
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
