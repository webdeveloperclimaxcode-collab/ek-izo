"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Spinner from "./Spinner";
import "swiper/css";
import "swiper/css/navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
}

export default function VideoTutorial() {
  const { theme } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage/videos");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    // Extract video ID from YouTube URL
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

  if (loading) {
    return (
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-linear-to-r from-[#FFFFFF] to-[#F0F3FF]"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-linear-to-r to-[#FFFFFF] from-[#F0F3FF]"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-[36px] font-bold tracking-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              VIDEO TUTORIAL
            </h2>
          </div>

          {/* Video Slider */}
          <div className="relative py-8">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: ".video-button-prev",
                nextEl: ".video-button-next",
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              loop={true}
              slidesPerView={1}
              spaceBetween={20}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
            >
              {videos.map((video) => (
                <SwiperSlide key={video.id}>
                  <div
                    onClick={() => openVideoModal(video)}
                    className={`rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer border group h-full duration-300 ${theme === "dark"
                      ? "bg-[#000000] border-gray-700"
                      : "bg-white border-gray-100"
                      }`}
                  >
                    {/* Video Thumbnail with Play Button */}
                    <div className="relative h-[220px]">
                      <Image
                        src={getYouTubeThumbnail(video.youtubeUrl)}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg
                            className="w-7 h-7 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Video Title */}
                    <div className="p-6">
                      <h3 className={`text-[17px] font-semibold line-clamp-2 min-h-[50px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons - Only show if there are videos */}
            {videos.length > 0 && (
              <>
                <button
                  className="video-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -ml-6"
                  aria-label="Previous video"
                >
                  <Image
                    src="/assets/images/HeroSection/leftIcon.svg"
                    alt="Previous"
                    width={60}
                    height={60}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </button>

                <button
                  className="video-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity -mr-6"
                  aria-label="Next video"
                >
                  <Image
                    src="/assets/images/HeroSection/righticon.svg"
                    alt="Next"
                    width={60}
                    height={60}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </button>
              </>
            )}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-12">
            <Link
              href="/video-tutorials"
              className="px-12 py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[16px]"
            >
              VIEW ALL VIDEO TUTORIAL
            </Link>
          </div>
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
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-700"}`}
            >
              <svg
                className="w-6 h-6"
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
                <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
