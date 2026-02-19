import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmPaymentRequest = await request.json();

    if (!body.paymentIntentId || !body.orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Update order status in database
    const updatedOrder = await prisma.websiteOrder.update({
      where: { id: body.orderId },
      data: {
        paymentStatus: "completed",
        orderStatus: "confirmed",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        paymentStatus: updatedOrder.paymentStatus,
        orderStatus: updatedOrder.orderStatus,
      },
    });
  } catch (error: any) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
