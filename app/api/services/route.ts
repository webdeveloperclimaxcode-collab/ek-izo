import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");

    const where: any = {
      publishOnWebsite: true,
    };

    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    } else if (categoryId) {
      where.subcategory = {
        categoryId: categoryId,
      };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
