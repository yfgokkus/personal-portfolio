import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET() {
  const userInfo = await prisma.user_info.findFirst({
    select: { email: true },
  });

  if (!userInfo) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: userInfo.email,
  });
}
