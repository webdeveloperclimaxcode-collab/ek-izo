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

interface ProjectsListingProps {
  searchQuery: string;
}

export default function ProjectsListing({ searchQuery }: ProjectsListingProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    if (!normalizedSearchQuery) return true;

    const title = project.title.toLowerCase();
    const description = (project.description || "").toLowerCase();
    const client = (project.client || "").toLowerCase();
    const location = (project.location || "").toLowerCase();

    return (
      title.includes(normalizedSearchQuery) ||
      description.includes(normalizedSearchQuery) ||
      client.includes(normalizedSearchQuery) ||
      location.includes(normalizedSearchQuery)
    );
  });

  const visibleProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 5);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setShowAllProjects(false);
  }, [searchQuery]);

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
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {!showAllProjects && filteredProjects.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllProjects(true)}
              className={`lg:text-2xl md:text-xl text-lg font-medium mb-4 p-5 transition-colors rounded-full border border-brand-secondary duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"} hover:bg-[#F6BA40] hover:text-white hover:cursor-pointer`}
            >
              {t("projectsPage.discoverAllProjects")}
            </button>
          )}
          <p className={`text-[15px] lg:text-4xl transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"}`}>
            {t("projectsPage.discoverPrestigious")}
          </p>
        </div>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10">
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => {
              // Calculate the column span based on the repeating 5-item pattern from Figma
              const getGridSpan = (idx: number) => {
                const mod = idx % 5;
                if (mod === 0) return "md:col-span-2"; // 1st item: Wide
                if (mod === 1) return "md:col-span-1"; // 2nd item: Narrow
                if (mod === 2) return "md:col-span-1"; // 3rd item: Narrow
                if (mod === 3) return "md:col-span-2"; // 4th item: Wide
                if (mod === 4) return "md:col-span-3"; // 5th item: Full width
                return "md:col-span-1";
              };

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`group ${getGridSpan(index)}`}
                >
                  <div
                    className={`overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 ${theme === "dark"
                      ? "bg-[#111111]"
                      : "bg-[#F7F7F7]" // Light gray background from Figma
                      }`}
                  >
                    {/* Project Image */}
                    <div
                      className={`relative w-full h-64 md:h-[320px] ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                        }`}
                    >
                      {project.images && project.images.length > 0 ? (
                        <>
                        <div className="absolute z-0 bg-black/75 w-full h-full flex items-center justify-center">
                  <Image
                    src="/assets/images/loader/loader.svg"
                    alt="Placeholder"
                    width={80}
                    height={80}
                    className="w-12 h-12 "
                  />  
                </div>
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className={
                              theme === "dark" ? "text-gray-500" : "text-gray-400"
                            }
                          >
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                      {/* Client / Category */}
                      {project.client && (
                        <span
                          className={`text-[13px] lg:text-xl uppercase tracking-wider mb-1 block transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-800"
                            }`}
                        >
                          {project.client}
                        </span>
                      )}

                      {/* Title */}
                      <h3
                        className={`text-[18px] lg:text-2xl font-medium uppercase mb-0.5 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-black"
                          }`}
                      >
                        {project.title}
                      </h3>

                      {/* Location */}
                      {project.location && (
                        <p
                          className={`text-[13px] lg:text-xl uppercase mb-3 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-800"
                            }`}
                        >
                          {project.location}
                        </p>
                      )}

                      {/* Description */}
                      {project.description && (
                        <p
                          className={`text-[15px] lg:text-xl leading-relaxed line-clamp-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          {project.description}
                        </p>
                      )}

                      {/* Duration (Optional, keep if needed but wasn't in Figma) */}
                      {project.duration && (
                        <p
                          className={`text-[13px] lg:text-xl mt-auto pt-3 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-800"
                            }`}
                        >
                          Duration: {project.duration}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <p
                className={`text-lg transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {t("projectsPage.noProjectsAvailable")}
              </p>
            </div>
          )}
        </div>
        {/* Projects Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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

                  <div className="p-5 flex-1 flex flex-col">
                    {project.client && (
                      <span className={`text-[11px] font-semibold uppercase tracking-wider mb-2 block transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"
                        }`}>
                        {project.client}
                      </span>
                    )}

                    <h3 className={`text-[18px] font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-secondary"}`}>
                      {project.title}
                    </h3>

                    {project.location && (
                      <p className={`text-[14px] font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-primary"
                        }`}>
                        {project.location}
                      </p>
                    )}

                    {project.description && (
                      <p className={`text-[13px] line-clamp-3 mb-3 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#6B7280]"
                        }`}>
                        {project.description}
                      </p>
                    )}

                    {project.duration && (
                      <p className={`text-[12px] mt-auto transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-brand-secondary"}`}>
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
        </div> */}
      </div>
    </section>
  );
}
