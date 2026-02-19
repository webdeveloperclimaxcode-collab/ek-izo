import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const homepageProducts = await prisma.homepageProduct.findMany({
      where: {
        isActive: true,
        product: {
          publishOnWebsite: true,
        },
      },
      include: {
        product: {
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

    // Map to return product data directly
    const products = homepageProducts.map((hp) => hp.product);

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage products" },
      { status: 500 }
    );
  }
}
