import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const homepageServices = await prisma.homepageService.findMany({
      where: {
        isActive: true,
        service:{
          publishOnWebsite:true,
        }
      },
      include: {
        service: {
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Map to return service data directly
    const services = homepageServices.map((hs) => hs.service);

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching homepage services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage services" },
      { status: 500 }
    );
  }
}
