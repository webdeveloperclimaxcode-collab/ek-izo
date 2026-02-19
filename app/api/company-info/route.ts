import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Get the first (and should be only) company info record
    const companyInfo = await prisma.companyInfo.findFirst();

    if (!companyInfo) {
      return NextResponse.json(
        { success: false, error: "Company info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: companyInfo });
  } catch (error) {
    console.error("Error fetching company info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company info" },
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
        { success: false, error: "Company info ID is required" },
        { status: 400 }
      );
    }

    const companyInfo = await prisma.companyInfo.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: companyInfo });
  } catch (error: any) {
    console.error("Error updating company info:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update company info" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyInfo = await prisma.companyInfo.create({
      data: body,
    });

    return NextResponse.json({ success: true, data: companyInfo });
  } catch (error: any) {
    console.error("Error creating company info:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create company info",
      },
      { status: 500 }
    );
  }
}
