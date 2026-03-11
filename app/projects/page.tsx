"use client";

import { useState } from "react";
import ProjectsHero from "@/components/ProjectsHero";
import ProjectsListing from "@/components/ProjectsListing";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <ProjectsHero searchQuery={searchQuery} onSearch={setSearchQuery} />
      <ProjectsListing searchQuery={searchQuery} />
    </div>
  );
}
