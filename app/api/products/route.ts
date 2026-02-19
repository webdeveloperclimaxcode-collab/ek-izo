import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");

    const where: any = {
      publishOnWebsite: true,
      status: "active",
    };

    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    } else if (categoryId) {
      where.subcategory = {
        categoryId: categoryId,
      };
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
