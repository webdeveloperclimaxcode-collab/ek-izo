"use client";

import { useParams } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div>
      <ProjectDetail projectId={projectId} />
    </div>
  );
}
