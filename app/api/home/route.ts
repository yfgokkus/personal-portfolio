// app/api/home/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

import { userInfoBaseSchema } from "@/lib/validations/user-info.validation";
import { toErrorString } from "@/lib/zod";

export async function GET() {
  try {
    const userInfo = await prisma.user_info.findFirst();

    if (!userInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "User info not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...userInfo,
        titles: userInfo.titles ? userInfo.titles.split(",") : [],
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user info",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = userInfoBaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: toErrorString(parsed.error),
        },
        { status: 400 },
      );
    }

    const existing = await prisma.user_info.findFirst();

    const userInfo = existing
      ? await prisma.user_info.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.user_info.create({
          data: parsed.data,
        });

    return NextResponse.json({
      success: true,
      data: {
        ...userInfo,
        titles: userInfo.titles ? userInfo.titles.split(",") : [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save user info" },
      { status: 500 },
    );
  }
}
