import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface CheckoutItem {
  type: "product" | "service";
  itemId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  deliveryInstructions?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in order" },
        { status: 400 }
      );
    }

    if (!body.fullName || !body.email || !body.phone || !body.deliveryAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required customer information" },
        { status: 400 }
      );
    }

    // Get user from database by email
    const user = await prisma.users.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch product and service details
    const orderItems = [];
    let subtotal = 0;

    for (const item of body.items) {
      if (item.type === "product") {
        const product = await prisma.product.findUnique({
          where: { id: item.itemId },
        });

        if (!product) {
          return NextResponse.json(
            { success: false, error: `Product not found. Please clear your cart and add items again.` },
            { status: 404 }
          );
        }

        const itemTotal = (product.price || 0) * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          type: "product",
          itemId: product.id,
          itemName: product.title,
          quantity: item.quantity,
          unitPrice: product.price || 0,
          total: itemTotal,
        });
      } else if (item.type === "service") {
        const service = await prisma.service.findUnique({
          where: { id: item.itemId },
        });

        if (!service) {
          return NextResponse.json(
            { success: false, error: `Service not found. Please clear your cart and add items again.` },
            { status: 404 }
          );
        }

        const itemTotal = (service.price || 0) * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          type: "service",
          itemId: service.id,
          itemName: service.title,
          quantity: item.quantity,
          unitPrice: service.price || 0,
          total: itemTotal,
        });
      }
    }

    // Calculate totals
    const deliveryCost = body.deliveryMethod === "express" ? 50 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + deliveryCost + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Create website order
    const websiteOrder = await prisma.websiteOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        orderType: body.items.some((i) => i.type === "product")
          ? body.items.some((i) => i.type === "service")
            ? "mixed"
            : "product"
          : "service",
        items: orderItems,
        deliveryAddress: body.deliveryAddress,
        deliveryCity: body.deliveryCity,
        deliveryPostalCode: body.deliveryPostalCode,
        deliveryInstructions: body.deliveryInstructions,
        deliveryMethod: body.deliveryMethod || "standard",
        subtotal,
        deliveryCost,
        tax,
        totalAmount,
        paymentMethod: body.paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: websiteOrder.id,
        orderNumber: websiteOrder.orderNumber,
        totalAmount: websiteOrder.totalAmount,
        orderStatus: websiteOrder.orderStatus,
        paymentStatus: websiteOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
