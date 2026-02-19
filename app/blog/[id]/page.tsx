"use client";

import { useParams } from "next/navigation";
import BlogDetail from "@/components/BlogDetail";

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;

  return (
    <div>
      <BlogDetail blogId={blogId} />
    </div>
  );
}
