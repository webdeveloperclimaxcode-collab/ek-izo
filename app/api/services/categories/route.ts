import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}
