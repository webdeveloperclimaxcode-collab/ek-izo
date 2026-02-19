// app/api/users/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma";
export async function GET() {
  const users = await prisma.users.findMany();
  return NextResponse.json({ success: true, users });
}
