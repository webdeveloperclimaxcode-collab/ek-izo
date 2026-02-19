import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.weWorkWith.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      logoUrl,
      websiteUrl,
      displayOrder,
    } = body;

    const company = await prisma.weWorkWith.create({
      data: {
        logoUrl,
        websiteUrl: websiteUrl || null,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create company",
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
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    const company = await prisma.weWorkWith.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update company" },
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
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    await prisma.weWorkWith.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Company deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete company" },
      { status: 500 }
    );
  }
}
