"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Project {
  id: string;
  title: string;
  description: string | null;
  client: string | null;
  location: string | null;
  completionDate: string | null;
  duration: string | null;
  images: string[];
  featured: boolean;
}

export default function ProjectsListing() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto text-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-16 transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
            {t("projectsPage.discoverAllProjects")}
          </h2>
          <p className={`text-[15px] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
            {t("projectsPage.discoverPrestigious")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group"
              >
                <div className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all h-full flex flex-col transition-colors duration-300 ${theme === "dark"
                  ? "bg-[#000000] border-gray-700"
                  : "bg-white border-gray-200"
                  }`}>
                  {/* Project Image */}
                  <div className={`relative h-64 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Client */}
                    {project.client && (
                      <span className={`text-[11px] font-semibold uppercase tracking-wider mb-2 block transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"
                        }`}>
                        {project.client}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className={`text-[18px] font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#9F001B]"}`}>
                      {project.title}
                    </h3>

                    {/* Location */}
                    {project.location && (
                      <p className={`text-[14px] font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"
                        }`}>
                        {project.location}
                      </p>
                    )}

                    {/* Description */}
                    {project.description && (
                      <p className={`text-[13px] line-clamp-3 mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"
                        }`}>
                        {project.description}
                      </p>
                    )}

                    {/* Duration */}
                    {project.duration && (
                      <p className={`text-[12px] mt-auto transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#9F001B]"}`}>
                        Duration: {project.duration}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className={`text-lg transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{t("projectsPage.noProjectsAvailable")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
