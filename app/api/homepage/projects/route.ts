import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const homepageProjects = await prisma.homepageProject.findMany({
      where: {
        isActive: true,
      },
      include: {
        project: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Map to return project data directly
    const projects = homepageProjects.map((hp) => hp.project);

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching homepage projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage projects" },
      { status: 500 }
    );
  }
}
