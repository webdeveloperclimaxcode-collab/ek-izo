import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const categories = await prisma.productCategory.findMany({
      orderBy: {
        name: "asc",
      },
      ...(limit && { take: parseInt(limit) }),
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product categories",
      },
      { status: 500 }
    );
  }
}
