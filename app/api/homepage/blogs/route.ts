import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const homepageBlogs = await prisma.homepageBlog.findMany({
      where: {
        isActive: true,
      },
      include: {
        blog: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Map to return blog data directly
    const blogs = homepageBlogs.map((hb) => hb.blog);

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching homepage blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage blogs" },
      { status: 500 }
    );
  }
}
