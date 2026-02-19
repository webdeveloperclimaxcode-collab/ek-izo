"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import Spinner from "./Spinner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Project {
  id: string;
  title: string;
  description: string | null;
  client: string | null;
  location: string | null;
  completionDate: string | null;
  duration: string | null;
  images: string[];
}

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{t("projectsPage.projectNotFound")}</p>
        </div>
      </section>
    );
  }

  const projectImages = project.images.length > 0 ? project.images : ["/assets/images/projects/p1.png"];

  return (
    <section className={`w-full py-12 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-[#EEF2F6]"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`flex items-center cursor-pointer gap-2 mb-6 transition-colors group ${theme === "dark"
            ? "text-gray-300 hover:text-[#9F001B]"
            : "text-[#1B2556] hover:text-[#9F001B]"
            }`}
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-[16px] font-semibold">{t("projectsPage.back")}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Project Images */}
          <div>
            {/* Main Image */}
            <div className={`relative rounded-[10px] h-[550px] mb-6 transition-colors duration-300 ${theme === "dark"
              ? "border-gray-700"
              : "border-[#D4D4D4]"
              }`} style={{ border: theme === "dark" ? "2px solid #4b5563" : "2px solid #D4D4D4" }}>
              <Image
                src={projectImages[selectedImage]}
                alt={project.title}
                fill
                className="rounded-[10px] object-cover"
              />

              {/* Navigation Arrows */}
              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev > 0 ? prev - 1 : projectImages.length - 1
                      )
                    }
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src="/assets/images/Products_page/slider_left_arrow.svg"
                      alt="Previous"
                      width={48}
                      height={48}
                      className="w-10"
                    />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev < projectImages.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src="/assets/images/Products_page/slider_right_arrow.svg"
                      alt="Next"
                      width={48}
                      height={48}
                      className="w-10"
                    />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {projectImages.length > 1 && (
              <div className="flex gap-6">
                {projectImages.slice(0, 3).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-32 flex-1 rounded-2xl overflow-hidden transition-all ${selectedImage === index
                      ? `border-[3px] ${theme === "dark" ? "border-gray-400" : "border-[#1B2556]"}`
                      : `border-[3px] ${theme === "dark" ? "border-gray-700 hover:border-gray-600" : "border-gray-300 hover:border-gray-400"}`
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Project Details */}
          <div>
            <h1 className={`text-[32px] font-bold mb-4 leading-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
              {project.title}
            </h1>

            {/* Project Info */}
            <div className="space-y-3 mb-6">
              {project.client && (
                <div className="flex items-start gap-2">
                  <span className={`text-[14px] font-semibold min-w-[100px] transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>{t("projectsPage.client")}:</span>
                  <span className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{project.client}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-start gap-2">
                  <span className={`text-[14px] font-semibold min-w-[100px] transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>{t("projectsPage.location")}:</span>
                  <span className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{project.location}</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-start gap-2">
                  <span className={`text-[14px] font-semibold min-w-[100px] transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>{t("projectsPage.duration")}:</span>
                  <span className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>{project.duration}</span>
                </div>
              )}
              {project.completionDate && (
                <div className="flex items-start gap-2">
                  <span className={`text-[14px] font-semibold min-w-[100px] transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>{t("projectsPage.completed")}:</span>
                  <span className={`text-[14px] transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                    {new Date(project.completionDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {project.description && (
              <div className={`text-[14px] leading-relaxed mb-6 whitespace-pre-line transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-[#6B7280]"}`}>
                {project.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
