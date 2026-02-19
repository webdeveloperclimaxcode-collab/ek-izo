import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

interface PaymentIntentRequest {
  amount: number;
  email: string;
  orderId: string;
  currency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json();

    if (!body.amount || !body.email || !body.orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const currency = (body.currency || "eur").toLowerCase();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.amount * 100), // Convert to cents
      currency: currency,
      receipt_email: body.email,
      metadata: {
        orderId: body.orderId,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
