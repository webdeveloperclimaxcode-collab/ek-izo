import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const sliders = await prisma.websiteSlider.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json({ success: true, data: sliders });
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}
