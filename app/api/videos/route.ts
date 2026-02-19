import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: {
        publishOnWebsite: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      youtubeUrl,
      publishOnWebsite,
    } = body;

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        youtubeUrl,
        publishOnWebsite: publishOnWebsite !== false,
      },
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create video",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}
