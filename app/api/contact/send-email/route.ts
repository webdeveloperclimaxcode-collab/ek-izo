import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Phone, and Message are required" },
        { status: 400 }
      );
    }

    // Send email with all fields (optional ones will be included if provided)
    await sendContactFormEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      surname: data.surname,
      city: data.city,
      province: data.province,
      subject: "Contact Form Submission",
      message: data.message,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
