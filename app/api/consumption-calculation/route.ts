import { NextResponse } from "next/server";
import { sendConsumptionCalculationEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.tileLength || !data.tileWidth || !data.tileThickness || !data.areaToCover || !data.groutLength) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email
    await sendConsumptionCalculationEmail({
      productName: data.productName,
      serviceName: data.serviceName,
      tileLength: data.tileLength,
      tileWidth: data.tileWidth,
      tileThickness: data.tileThickness,
      areaToCover: data.areaToCover,
      groutLength: data.groutLength,
      userEmail: data.userEmail,
      userName: data.userName,
    });

    return NextResponse.json({
      success: true,
      message: "Calculation request sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending consumption calculation email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send calculation request" },
      { status: 500 }
    );
  }
}
