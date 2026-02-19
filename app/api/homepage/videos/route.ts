import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const homepageVideos = await prisma.homepageVideo.findMany({
      where: {
        isActive: true,
      },
      include: {
        video: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Map to return video data directly
    const videos = homepageVideos.map((hv) => hv.video);

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Error fetching homepage videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage videos" },
      { status: 500 }
    );
  }
}
