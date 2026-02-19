import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const where: any = {
      publishOnWebsite: true,
    };

    if (featured === "true") {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      client,
      location,
      duration,
      completionDate,
      publishOnWebsite,
      featured,
      images,
      videos,
      documents,
    } = body;

    // Create project - images should already be URLs from your upload system
    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        client: client || null,
        location: location || null,
        duration: duration || null,
        completionDate: completionDate ? new Date(completionDate) : null,
        images: images || [],
        videos: videos || [],
        documents: documents || null,
        publishOnWebsite: publishOnWebsite !== false,
        featured: featured === true,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create project",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        completionDate: data.completionDate ? new Date(data.completionDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
