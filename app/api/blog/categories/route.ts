import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            blogs: {
              where: {
                publishOnWebsite: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.create({
      data: { name },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Error creating blog category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog category" },
      { status: 500 }
    );
  }
}
