import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, fullName, photoURL } = body;

    console.log("Sync user request:", { uid, email, fullName });

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: "UID and email are required" },
        { status: 400 }
      );
    }

    // Check if user exists by email
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update last login and profile photo if provided
      const updatedUser = await prisma.users.update({
        where: { email },
        data: {
          lastLogin: new Date(),
          ...(photoURL && { profile: photoURL }), // Update profile photo if provided
        },
      });

      console.log("User updated:", updatedUser.email);

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: "User updated",
      });
    }

    // Create new user with website_user role
    // Generate a unique username if email prefix already exists
    let username = email.split("@")[0];
    let usernameExists = await prisma.users.findUnique({
      where: { username },
    });
    
    // If username exists, append random string
    if (usernameExists) {
      username = `${username}_${Math.random().toString(36).substring(7)}`;
    }

    const newUser = await prisma.users.create({
      data: {
        id: uid,
        username,
        email,
        password: `oauth_${uid}`, // Use OAuth identifier for password field
        fullName: fullName || email.split("@")[0],
        profile: photoURL || null, // Save profile photo from Firebase
        role: "website_user",
        status: "active",
        lastLogin: new Date(),
      },
    });

    console.log("User created:", newUser.email);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created",
    });
  } catch (error: any) {
    console.error("Error syncing user - Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to sync user",
        details: error.code || "Unknown error"
      },
      { status: 500 }
    );
  }
}
