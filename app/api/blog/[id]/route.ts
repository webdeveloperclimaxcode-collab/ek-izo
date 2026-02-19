import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
