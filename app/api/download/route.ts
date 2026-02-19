import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename");

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Fetch the file from the external URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    // Set content type from original response or default to PDF
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    
    // Force download with filename
    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename || "document.pdf"}"`
    );

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download file" },
      { status: 500 }
    );
  }
}
